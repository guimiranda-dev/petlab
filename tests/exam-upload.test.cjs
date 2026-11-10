const assert = require('node:assert/strict');
const { test, after } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

// Carrega o TypeScript da aplicação sem adicionar um runner ao projeto.
const root = path.resolve(__dirname, '..');
const originalResolve = Module._resolveFilename;
const originalLoad = Module._load;
let currentSupabase;
Module._resolveFilename = function (specifier, ...args) {
  return originalResolve.call(
    this,
    specifier.startsWith('@/') ? path.join(root, specifier.slice(2)) : specifier,
    ...args,
  );
};
Module._load = function (specifier, ...args) {
  if (specifier === '@/utils/supabase/api') return { createClient: () => currentSupabase };
  return originalLoad.call(this, specifier, ...args);
};
for (const extension of ['.ts', '.tsx']) {
  require.extensions[extension] = (module, filename) => {
    const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
        target: ts.ScriptTarget.ES2022,
      },
      fileName: filename,
    });
    module._compile(output.outputText, filename);
  };
}
const { uploadExam } = require('../services/uploadExam.ts');
const { default: handler } = require('../pages/api/exams/[id]/upload.ts');
const { buildExamPdfData } = require('../services/examPdf.tsx');
const originalFetch = global.fetch;
const originalToken = process.env.EXAM_UPLOAD_TOKEN;
after(() => {
  global.fetch = originalFetch;
  if (originalToken === undefined) delete process.env.EXAM_UPLOAD_TOKEN;
  else process.env.EXAM_UPLOAD_TOKEN = originalToken;
});

function exam(type = 'hemograma') {
  return {
    id: '123',
    date: '2026-11-10T23:30:00-03:00',
    exam_type: type,
    obs: '',
    pet_id: 'pet-1',
    vet_id: 'vet-1',
    vet: { name: 'Veterinário', cmv: '123' },
    pet: {
      name: 'Animal de teste',
      external_id: '725',
      specie: 'Canino',
      breed: 'SRD',
      gender: 'Macho',
      birth_date: '2020-01-01',
      owner_id: 'owner-1',
      owner: { id: 'owner-1', name: 'Tutor de teste' },
    },
    exam_values: [
      {
        exam_reference_id: 1,
        value: '5',
        relative: '',
        exam_reference_values: {
          name: 'Resultado',
          order: 1,
          exam_subgroup: 'Eritrograma',
          unit: '',
          adult_dog_reference: '4–6',
          puppy_dog_reference: '3–7',
          adult_cat_reference: '2–8',
          puppy_cat_reference: '1–9',
        },
      },
    ],
  };
}

function supabase(user, data = exam()) {
  const query = {
    select: () => query,
    eq: () => query,
    is: (field, value) => {
      assert.equal(field, 'deleted_at');
      assert.equal(value, null);
      return query;
    },
    maybeSingle: async () => ({ data, error: null }),
  };
  return { auth: { getUser: async () => ({ data: { user }, error: null }) }, from: () => query };
}

// Sem rede: os testes renderizam PDFs reais e inspecionam o multipart antes do transporte.
test('gera os cinco tipos com imagens e envia os campos e headers do contrato', async () => {
  for (const type of [
    'hemograma',
    'bioquimico',
    'coproparasitologico',
    'urinalise',
    'reticulocitos',
  ]) {
    global.fetch = async (url, options) => {
      assert.equal(
        url,
        'https://almanaque-chat-ai-870579198997.us-central1.run.app/integrations/simplesvet/exames',
      );
      assert.equal(options.method, 'POST');
      assert.equal(options.headers.Authorization, 'Bearer token-de-teste');
      assert.equal(options.headers['Idempotency-Key'], 'petlab-exame-123');
      assert.equal(options.headers['Content-Type'], undefined);
      assert.equal(options.body.get('codigoAnimal'), '725');
      assert.equal(options.body.get('tipoExame'), type);
      assert.equal(options.body.get('laboratorio'), 'Petlab');
      assert.equal(options.body.get('dataExame'), '2026-11-10');
      const file = options.body.get('file');
      assert.equal(file.type, 'application/pdf');
      assert.match(file.name, /\.pdf$/);
      const bytes = Buffer.from(await file.arrayBuffer());
      assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
      assert.ok(bytes.includes(Buffer.from('/Subtype /Image')), 'PDF inclui imagens locais');
      return new Response(null, { status: 201 });
    };
    await uploadExam(exam(type), 'token-de-teste');
  }
});

test('valida animal e data antes de enviar', async () => {
  global.fetch = async () => assert.fail('Não deve enviar dados inválidos');
  for (const code of ['', 'abc', '0', '-1']) {
    const data = exam();
    data.pet.external_id = code;
    await assert.rejects(uploadExam(data, 'token'), { status: 422 });
  }
  const data = exam();
  data.date = 'inválida';
  await assert.rejects(uploadExam(data, 'token'), { status: 422 });
});

test('seleciona referências por espécie e idade', () => {
  const data = exam();
  assert.equal(buildExamPdfData(data).exams.values[0].reference_value, '4–6');
  data.pet.specie = 'Felino';
  assert.equal(buildExamPdfData(data).exams.values[0].reference_value, '2–8');
  data.pet.birth_date = '2026-11-01';
  assert.equal(buildExamPdfData(data).exams.values[0].reference_value, '1–9');
});

test('traduz falhas HTTP e timeout sem expor a resposta externa', async () => {
  for (const [upstream, expected] of [
    [401, 502],
    [403, 502],
    [409, 409],
    [422, 422],
    [429, 429],
    [500, 502],
  ]) {
    global.fetch = async () => new Response('detalhes privados', { status: upstream });
    await assert.rejects(
      uploadExam(exam(), 'token'),
      (error) => error.status === expected && !error.message.includes('detalhes privados'),
    );
  }
  global.fetch = async () => {
    throw new DOMException('timeout', 'TimeoutError');
  };
  await assert.rejects(uploadExam(exam(), 'token'), { status: 504 });
});

test('rota exige sessão, configuração e exame visível; retorna sucesso e erros do serviço', async () => {
  const invoke = async (method = 'POST') => {
    const response = {
      statusCode: 200,
      body: null,
      headers: {},
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(body) {
        this.body = body;
        return this;
      },
      setHeader(name, value) {
        this.headers[name] = value;
      },
    };
    await handler({ method, query: { id: '123' }, cookies: {} }, response);
    return response;
  };
  assert.equal((await invoke('GET')).statusCode, 405);
  global.fetch = async () => assert.fail('Não deveria enviar');
  currentSupabase = supabase(null);
  assert.equal((await invoke()).statusCode, 401);
  currentSupabase = supabase({ id: 'user-1' });
  delete process.env.EXAM_UPLOAD_TOKEN;
  assert.equal((await invoke()).statusCode, 503);
  process.env.EXAM_UPLOAD_TOKEN = 'test-token';
  currentSupabase = supabase({ id: 'user-1' }, null);
  assert.equal((await invoke()).statusCode, 404);
  currentSupabase = supabase({ id: 'user-1' });
  global.fetch = async () => new Response(null, { status: 201 });
  assert.equal((await invoke()).statusCode, 200);
  global.fetch = async () => new Response(null, { status: 429 });
  const response = await invoke();
  assert.equal(response.statusCode, 429);
  assert.match(response.body.error, /Limite/);
  assert.equal(response.body.upstreamStatus, 429);
  assert.equal(response.body.code, 'resposta_integracao');
  for (const step of ['autenticacao', 'consulta_exame', 'geracao_pdf', 'integracao', 'total']) {
    assert.equal(typeof response.body.timingsMs[step], 'number');
  }
  assert.match(response.headers['Server-Timing'], /geracao_pdf;dur=/);
  assert.match(response.headers['Server-Timing'], /integracao;dur=/);
});

test('registra a falha de consulta no servidor sem expor detalhes na resposta', async () => {
  currentSupabase = supabase({ id: 'user-1' });
  currentSupabase.from = () => {
    throw new Error('detalhes internos da consulta');
  };
  process.env.EXAM_UPLOAD_TOKEN = 'test-token';
  const originalError = console.error;
  const logs = [];
  console.error = (...args) => logs.push(args);
  try {
    const response = {
      statusCode: 200,
      body: null,
      setHeader() {},
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(body) {
        this.body = body;
        return this;
      },
    };
    await handler({ method: 'POST', query: { id: '123' }, cookies: {} }, response);
    assert.equal(response.statusCode, 500);
    assert.equal(response.body.code, 'consulta_exame');
    assert.ok(!JSON.stringify(response.body).includes('detalhes internos'));
    assert.equal(logs[0][0], '[exam-upload:consulta_exame]');
    assert.equal(logs[0][1].message, 'detalhes internos da consulta');
  } finally {
    console.error = originalError;
  }
});

test('preserva status externo e rastreio; registra corpo limitado sem vazar token', async () => {
  const originalError = console.error;
  const logs = [];
  console.error = (...args) => logs.push(args);
  global.fetch = async () =>
    new Response(
      JSON.stringify({
        error: 'Falha ao anexar laudo',
        authorization: 'Bearer segredo-de-teste',
        repeatedSecret: 'segredo-de-teste',
        details: 'x'.repeat(5000),
      }),
      { status: 503, headers: { 'x-request-id': 'request-test-123' } },
    );
  try {
    await assert.rejects(uploadExam(exam(), 'segredo-de-teste'), (error) => {
      assert.equal(error.status, 502);
      assert.equal(error.upstream.status, 503);
      assert.equal(error.upstream.requestId, 'request-test-123');
      assert.match(error.message, /HTTP 503/);
      return true;
    });
    assert.equal(logs[0][0], '[exam-upload:resposta_integracao]');
    const diagnostic = logs[0][1];
    assert.equal(diagnostic.status, 503);
    assert.equal(diagnostic.requestId, 'request-test-123');
    assert.match(diagnostic.responseBody, /Falha ao anexar laudo/);
    assert.ok(!diagnostic.responseBody.includes('segredo-de-teste'));
    assert.ok(diagnostic.responseBody.length <= 4096);
  } finally {
    console.error = originalError;
  }
});

test('mede a espera da integração separadamente da geração do PDF', async () => {
  const { ExamUploadTimings } = require('../services/examUploadTimings.ts');
  const timings = new ExamUploadTimings();
  global.fetch = async () => {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return new Response(null, { status: 201 });
  };
  await uploadExam(exam(), 'token-de-teste', timings);
  const measured = timings.snapshot();
  assert.ok(measured.geracao_pdf >= 0);
  assert.ok(measured.integracao >= 15, 'A espera HTTP deve entrar no tempo da integração');
  assert.ok(measured.total >= measured.integracao);
});
