'use client';

import { Input } from '@heroui/input';
import { Card, CardBody } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { Link } from '@heroui/link';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { Select, SelectItem } from '@heroui/select';
import { Header } from '@/components/header';
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { Button } from '@heroui/button';
import { getExamsQueryHook } from '@/hooks/getExamsQuery.hook';

const exams = [
  { key: 'Creatinina', label: 'Creatinina' },
  { key: 'Glóbulos Vermelhos', label: 'Glóbulos Vermelhos' },
  { key: 'Glóbulos Brancos', label: 'Glóbulos Brancos' },
];

const guardians = [
  {
    label: 'John Doe',
    key: 'john_doe',
    description: '(11) 91234-5678',
  },
  {
    label: 'Jane Smith',
    key: 'jane_smith',
    description: '(21) 99876-5432',
  },
  {
    label: 'Carlos Silva',
    key: 'carlos_silva',
    description: '(31) 98765-4321',
  },
  {
    label: 'Ana Oliveira',
    key: 'ana_oliveira',
    description: '(41) 91234-5678',
  },
  {
    label: 'Lucas Pereira',
    key: 'lucas_pereira',
    description: '(51) 99876-1234',
  },
  {
    label: 'Mariana Costa',
    key: 'mariana_costa',
    description: '(61) 99888-7777',
  },
  {
    label: 'Fernanda Lima',
    key: 'fernanda_lima',
    description: '(71) 98765-1111',
  },
  {
    label: 'Rafael Souza',
    key: 'rafael_souza',
    description: '(81) 97654-2222',
  },
  {
    label: 'Beatriz Rocha',
    key: 'beatriz_rocha',
    description: '(91) 93456-7890',
  },
  {
    label: 'Pedro Martins',
    key: 'pedro_martins',
    description: '(85) 91234-0000',
  },
  {
    label: 'Camila Freitas',
    key: 'camila_freitas',
    description: '(95) 90011-2233',
  },
  {
    label: 'Bruno Almeida',
    key: 'bruno_almeida',
    description: '(19) 99800-1122',
  },
  {
    label: 'Isabela Fernandes',
    key: 'isabela_fernandes',
    description: '(62) 98770-3344',
  },
];

const animals = [
  { key: 'Banguela', label: 'Banguela' },
  { key: 'Goose', label: 'Goose' },
  { key: 'Oliver', label: 'Oliver' },
];

export default function Home() {
  const { data, isFetching } = getExamsQueryHook();

  return (
    <>
      <Header />
      <section className='container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 p-4 gap-4'>
        <div className='flex flex-col gap-4'>
          <div className='mb-6'>
            <h1 className='text-3xl text-slate-800 mb-0 font-bold'>
              Formulário de criação de exame
            </h1>
            <h2 className='text-lg text-slate-800'>
              Preencha as informações abaixo para gerar um novo exame
            </h2>
          </div>

          <div className='flex items-center justify-center gap-2'>
            <Autocomplete
              className='w-full'
              defaultItems={guardians}
              label='Nome do tutor'
              listboxProps={{
                emptyContent: (
                  <div className='flex flex-col gap-2'>
                    <span className='text-sm text-muted'>Nenhum pet encontrado</span>
                    <Link isBlock color='primary' href='#'>
                      <AiOutlinePlusCircle className='mr-2' />
                      Novo pet
                    </Link>
                  </div>
                ),
              }}
              placeholder='Pesquise um tutor ou crie um novo'
            >
              {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
            </Autocomplete>

            <Select className='w-full' label='Pet' placeholder='Selecione uma opção'>
              {animals.map((animal) => (
                <SelectItem key={animal.key}>{animal.label}</SelectItem>
              ))}
            </Select>
          </div>

          {/*<Input label='Nome do Pet' placeholder='Ex: Bobby' />*/}
          {/*<Input label='Nome do Tutor' placeholder='Ex: Maria da Silva' />*/}

          <Divider className='my-4' />

          <div className='flex items-center justify-center gap-2'>
            <Select className='max-w-xs' label='Selecione'>
              {exams.map((item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              ))}
            </Select>
            <Input label='Valor do exame' placeholder='Digite aqui' />
            <Input label='Valor de referência' placeholder='Digite aqui' />

            <div>
              <Link isBlock color='danger' href='#'>
                <AiOutlineMinusCircle className='text-danger-500' />
              </Link>
            </div>
          </div>

          <div>
            <Link isBlock color='primary' href='#'>
              <AiOutlinePlusCircle className='mr-2' />
              Adicionar exame
            </Link>
          </div>
        </div>

        <div className='p-4 w-full'>
          <Card className='w-full'>
            <CardBody>
              <p>Make beautiful websites regardless of your design experience.</p>
            </CardBody>
          </Card>
        </div>
      </section>
    </>
  );
}
