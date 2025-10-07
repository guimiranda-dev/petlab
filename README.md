# Fluxogramas - Sistema de Gerenciamento de Exames Veterinários

## 1. Visão Geral do Sistema

```mermaid
flowchart TD
    Start([Início]) --> Menu[Menu Principal]

    Menu --> Cadastros{Módulo de<br/>Cadastros}
    Menu --> Agendamento{Módulo de<br/>Agendamento}
    Menu --> Exames{Módulo de<br/>Exames}
    Menu --> Resultados{Módulo de<br/>Resultados}
    Menu --> Sair([Sair do Sistema])

    Cadastros --> CadClientes[Cadastro de<br/>Clientes]
    Cadastros --> CadAnimais[Cadastro de<br/>Animais]
    Cadastros --> CadVets[Cadastro de<br/>Veterinários]
    Cadastros --> CadExames[Cadastro de<br/>Tipos de Exames]

    Agendamento --> AgendarExame[Agendar<br/>Exame]
    Agendamento --> ConsultaAgenda[Consultar<br/>Agenda]

    Exames --> RealizarExame[Realizar<br/>Exame]
    Exames --> StatusExame[Verificar Status<br/>de Exames]

    Resultados --> LancarResultado[Lançar<br/>Resultado]
    Resultados --> ConsultarResultado[Consultar<br/>Resultados]
    Resultados --> ImprimirResultado[Imprimir<br/>Laudo]

    CadClientes --> Menu
    CadAnimais --> Menu
    CadVets --> Menu
    CadExames --> Menu
    AgendarExame --> Menu
    ConsultaAgenda --> Menu
    RealizarExame --> Menu
    StatusExame --> Menu
    LancarResultado --> Menu
    ConsultarResultado --> Menu
    ImprimirResultado --> Menu

    style Start fill:#90EE90
    style Sair fill:#FFB6C1
    style Menu fill:#87CEEB
    style Cadastros fill:#FFE4B5
    style Agendamento fill:#FFE4B5
    style Exames fill:#FFE4B5
    style Resultados fill:#FFE4B5
```

## 2. Fluxograma Detalhado - Cadastro de Clientes

```mermaid
flowchart TD
    Start([Início]) --> MenuClientes[Menu Cadastro<br/>de Clientes]

    MenuClientes --> Opcao{Escolher<br/>Opção}

    Opcao -->|Novo| NovoCliente[Inserir Dados<br/>do Cliente]
    Opcao -->|Editar| BuscarCliente[Buscar Cliente<br/>Existente]
    Opcao -->|Excluir| BuscarClienteExcluir[Buscar Cliente<br/>para Excluir]
    Opcao -->|Consultar| ConsultarCliente[Pesquisar<br/>Cliente]
    Opcao -->|Voltar| Fim([Retornar ao<br/>Menu Principal])

    NovoCliente --> DadosCliente[/Nome, CPF/CNPJ,<br/>Telefone, Email,<br/>Endereço/]
    DadosCliente --> ValidarDados{Dados<br/>Válidos?}
    ValidarDados -->|Não| ErroValidacao[Exibir Erros<br/>de Validação]
    ErroValidacao --> DadosCliente
    ValidarDados -->|Sim| VerificarDuplicado{CPF/CNPJ já<br/>cadastrado?}
    VerificarDuplicado -->|Sim| ErroDuplicado[Exibir Erro:<br/>Cliente já existe]
    ErroDuplicado --> MenuClientes
    VerificarDuplicado -->|Não| SalvarCliente[(Salvar no<br/>Banco de Dados)]
    SalvarCliente --> Sucesso[Exibir Mensagem<br/>de Sucesso]

    BuscarCliente --> PesquisarCliente[/Inserir CPF/CNPJ<br/>ou Nome/]
    PesquisarCliente --> ClienteEncontrado{Cliente<br/>Encontrado?}
    ClienteEncontrado -->|Não| NaoEncontrado[Exibir:<br/>Cliente não encontrado]
    NaoEncontrado --> MenuClientes
    ClienteEncontrado -->|Sim| EditarDados[Editar Dados<br/>do Cliente]
    EditarDados --> ValidarEdicao{Dados<br/>Válidos?}
    ValidarEdicao -->|Não| ErroEdicao[Exibir Erros]
    ErroEdicao --> EditarDados
    ValidarEdicao -->|Sim| AtualizarCliente[(Atualizar no<br/>Banco de Dados)]
    AtualizarCliente --> Sucesso

    BuscarClienteExcluir --> PesquisarExcluir[/Inserir CPF/CNPJ<br/>ou Nome/]
    PesquisarExcluir --> ClienteExcluir{Cliente<br/>Encontrado?}
    ClienteExcluir -->|Não| NaoEncontradoExcluir[Exibir:<br/>Cliente não encontrado]
    NaoEncontradoExcluir --> MenuClientes
    ClienteExcluir -->|Sim| VerificarVinculos{Possui animais<br/>ou exames<br/>vinculados?}
    VerificarVinculos -->|Sim| ErroVinculo[Exibir: Não é possível<br/>excluir cliente<br/>com vínculos]
    ErroVinculo --> MenuClientes
    VerificarVinculos -->|Não| ConfirmarExclusao{Confirmar<br/>Exclusão?}
    ConfirmarExclusao -->|Não| MenuClientes
    ConfirmarExclusao -->|Sim| ExcluirCliente[(Excluir do<br/>Banco de Dados)]
    ExcluirCliente --> Sucesso

    ConsultarCliente --> FiltrosConsulta[/Filtros: Nome,<br/>CPF/CNPJ, Cidade/]
    FiltrosConsulta --> ListarClientes[Exibir Lista<br/>de Clientes]
    ListarClientes --> MenuClientes

    Sucesso --> MenuClientes

    style Start fill:#90EE90
    style Fim fill:#FFB6C1
    style SalvarCliente fill:#E6E6FA
    style AtualizarCliente fill:#E6E6FA
    style ExcluirCliente fill:#E6E6FA
    style Sucesso fill:#98FB98
```

## 3. Fluxograma Detalhado - Cadastro de Animais

```mermaid
flowchart TD
    Start([Início]) --> MenuAnimais[Menu Cadastro<br/>de Animais]

    MenuAnimais --> OpcaoAnimal{Escolher<br/>Opção}

    OpcaoAnimal -->|Novo| SelecionarDono[Selecionar<br/>Cliente/Dono]
    OpcaoAnimal -->|Editar| BuscarAnimal[Buscar Animal<br/>Existente]
    OpcaoAnimal -->|Excluir| BuscarAnimalExcluir[Buscar Animal<br/>para Excluir]
    OpcaoAnimal -->|Consultar| ConsultarAnimal[Pesquisar<br/>Animais]
    OpcaoAnimal -->|Voltar| Fim([Retornar ao<br/>Menu Principal])

    SelecionarDono --> ClienteExiste{Cliente<br/>Cadastrado?}
    ClienteExiste -->|Não| CadastrarCliente[Ir para Cadastro<br/>de Cliente]
    CadastrarCliente --> SelecionarDono
    ClienteExiste -->|Sim| DadosAnimal[/Nome, Espécie,<br/>Raça, Idade,<br/>Peso, Sexo/]

    DadosAnimal --> ValidarAnimal{Dados<br/>Válidos?}
    ValidarAnimal -->|Não| ErroAnimal[Exibir Erros<br/>de Validação]
    ErroAnimal --> DadosAnimal
    ValidarAnimal -->|Sim| HistoricoMedico[/Histórico Médico,<br/>Alergias,<br/>Observações/]
    HistoricoMedico --> SalvarAnimal[(Salvar no<br/>Banco de Dados)]
    SalvarAnimal --> GerarID[Gerar ID único<br/>do Animal]
    GerarID --> SucessoAnimal[Exibir Mensagem<br/>de Sucesso]

    BuscarAnimal --> PesquisarAnimal[/Nome do Animal<br/>ou ID ou<br/>Nome do Dono/]
    PesquisarAnimal --> AnimalEncontrado{Animal<br/>Encontrado?}
    AnimalEncontrado -->|Não| NaoEncontradoAnimal[Exibir:<br/>Animal não encontrado]
    NaoEncontradoAnimal --> MenuAnimais
    AnimalEncontrado -->|Sim| EditarAnimal[Editar Dados<br/>do Animal]
    EditarAnimal --> ValidarEdicaoAnimal{Dados<br/>Válidos?}
    ValidarEdicaoAnimal -->|Não| ErroEdicaoAnimal[Exibir Erros]
    ErroEdicaoAnimal --> EditarAnimal
    ValidarEdicaoAnimal -->|Sim| AtualizarAnimal[(Atualizar no<br/>Banco de Dados)]
    AtualizarAnimal --> SucessoAnimal

    BuscarAnimalExcluir --> PesquisarAnimalExcluir[/Nome ou ID<br/>do Animal/]
    PesquisarAnimalExcluir --> AnimalExcluirEncontrado{Animal<br/>Encontrado?}
    AnimalExcluirEncontrado -->|Não| NaoEncontradoExcluirAnimal[Exibir:<br/>Animal não encontrado]
    NaoEncontradoExcluirAnimal --> MenuAnimais
    AnimalExcluirEncontrado -->|Sim| VerificarExames{Possui exames<br/>pendentes ou<br/>em andamento?}
    VerificarExames -->|Sim| ErroExames[Exibir: Não é possível<br/>excluir animal<br/>com exames ativos]
    ErroExames --> MenuAnimais
    VerificarExames -->|Não| ConfirmarExclusaoAnimal{Confirmar<br/>Exclusão?}
    ConfirmarExclusaoAnimal -->|Não| MenuAnimais
    ConfirmarExclusaoAnimal -->|Sim| ExcluirAnimal[(Excluir do<br/>Banco de Dados)]
    ExcluirAnimal --> SucessoAnimal

    ConsultarAnimal --> FiltrosAnimal[/Filtros: Nome,<br/>Espécie, Dono,<br/>ID/]
    FiltrosAnimal --> ListarAnimais[Exibir Lista<br/>de Animais]
    ListarAnimais --> DetalheAnimal{Ver Detalhes?}
    DetalheAnimal -->|Sim| ExibirFicha[Exibir Ficha<br/>Completa do Animal]
    DetalheAnimal -->|Não| MenuAnimais
    ExibirFicha --> MenuAnimais

    SucessoAnimal --> MenuAnimais

    style Start fill:#90EE90
    style Fim fill:#FFB6C1
    style SalvarAnimal fill:#E6E6FA
    style AtualizarAnimal fill:#E6E6FA
    style ExcluirAnimal fill:#E6E6FA
    style SucessoAnimal fill:#98FB98
```

## 4. Fluxograma Detalhado - Cadastro de Veterinários

```mermaid
flowchart TD
    Start([Início]) --> MenuVet[Menu Cadastro<br/>de Veterinários]

    MenuVet --> OpcaoVet{Escolher<br/>Opção}

    OpcaoVet -->|Novo| NovoVet[Inserir Dados<br/>do Veterinário]
    OpcaoVet -->|Editar| BuscarVet[Buscar Veterinário<br/>Existente]
    OpcaoVet -->|Excluir| BuscarVetExcluir[Buscar Veterinário<br/>para Excluir]
    OpcaoVet -->|Consultar| ConsultarVet[Pesquisar<br/>Veterinários]
    OpcaoVet -->|Voltar| Fim([Retornar ao<br/>Menu Principal])

    NovoVet --> DadosVet[/Nome, CRMV,<br/>Especialidade,<br/>Telefone, Email/]
    DadosVet --> ValidarCRMV{CRMV<br/>Válido?}
    ValidarCRMV -->|Não| ErroCRMV[Exibir Erro:<br/>CRMV Inválido]
    ErroCRMV --> DadosVet
    ValidarCRMV -->|Sim| VerificarCRMVDuplicado{CRMV já<br/>cadastrado?}
    VerificarCRMVDuplicado -->|Sim| ErroDuplicadoCRMV[Exibir Erro:<br/>CRMV já existe]
    ErroDuplicadoCRMV --> MenuVet
    VerificarCRMVDuplicado -->|Não| HorarioAtendimento[/Definir Horários<br/>de Atendimento/]
    HorarioAtendimento --> ExamesTipos[/Selecionar Tipos<br/>de Exames que<br/>Realiza/]
    ExamesTipos --> SalvarVet[(Salvar no<br/>Banco de Dados)]
    SalvarVet --> SucessoVet[Exibir Mensagem<br/>de Sucesso]

    BuscarVet --> PesquisarVet[/CRMV ou<br/>Nome/]
    PesquisarVet --> VetEncontrado{Veterinário<br/>Encontrado?}
    VetEncontrado -->|Não| NaoEncontradoVet[Exibir:<br/>Veterinário não encontrado]
    NaoEncontradoVet --> MenuVet
    VetEncontrado -->|Sim| EditarVet[Editar Dados<br/>do Veterinário]
    EditarVet --> ValidarEdicaoVet{Dados<br/>Válidos?}
    ValidarEdicaoVet -->|Não| ErroEdicaoVet[Exibir Erros]
    ErroEdicaoVet --> EditarVet
    ValidarEdicaoVet -->|Sim| AtualizarVet[(Atualizar no<br/>Banco de Dados)]
    AtualizarVet --> SucessoVet

    BuscarVetExcluir --> PesquisarVetExcluir[/CRMV ou<br/>Nome/]
    PesquisarVetExcluir --> VetExcluirEncontrado{Veterinário<br/>Encontrado?}
    VetExcluirEncontrado -->|Não| NaoEncontradoExcluirVet[Exibir:<br/>Veterinário não encontrado]
    NaoEncontradoExcluirVet --> MenuVet
    VetExcluirEncontrado -->|Sim| VerificarAgendamentos{Possui<br/>agendamentos<br/>futuros?}
    VerificarAgendamentos -->|Sim| ErroAgendamento[Exibir: Não é possível<br/>excluir veterinário<br/>com agendamentos]
    ErroAgendamento --> MenuVet
    VerificarAgendamentos -->|Não| ConfirmarExclusaoVet{Confirmar<br/>Exclusão?}
    ConfirmarExclusaoVet -->|Não| MenuVet
    ConfirmarExclusaoVet -->|Sim| DesativarVet[(Desativar<br/>Veterinário)]
    DesativarVet --> SucessoVet

    ConsultarVet --> FiltrosVet[/Filtros: Nome,<br/>CRMV, Especialidade,<br/>Disponibilidade/]
    FiltrosVet --> ListarVets[Exibir Lista<br/>de Veterinários]
    ListarVets --> DetalheVet{Ver Agenda?}
    DetalheVet -->|Sim| ExibirAgenda[Exibir Agenda<br/>do Veterinário]
    DetalheVet -->|Não| MenuVet
    ExibirAgenda --> MenuVet

    SucessoVet --> MenuVet

    style Start fill:#90EE90
    style Fim fill:#FFB6C1
    style SalvarVet fill:#E6E6FA
    style AtualizarVet fill:#E6E6FA
    style DesativarVet fill:#E6E6FA
    style SucessoVet fill:#98FB98
```

## 5. Fluxograma Detalhado - Cadastro de Tipos de Exames

```mermaid
flowchart TD
    Start([Início]) --> MenuExamesTipo[Menu Cadastro de<br/>Tipos de Exames]

    MenuExamesTipo --> OpcaoExameTipo{Escolher<br/>Opção}

    OpcaoExameTipo -->|Novo| NovoTipoExame[Criar Novo<br/>Tipo de Exame]
    OpcaoExameTipo -->|Editar| BuscarTipoExame[Buscar Tipo<br/>de Exame]
    OpcaoExameTipo -->|Excluir| BuscarTipoExcluir[Buscar Tipo<br/>para Excluir]
    OpcaoExameTipo -->|Consultar| ConsultarTipos[Listar Tipos<br/>de Exames]
    OpcaoExameTipo -->|Voltar| Fim([Retornar ao<br/>Menu Principal])

    NovoTipoExame --> DadosTipoExame[/Nome do Exame,<br/>Categoria,<br/>Código/]
    DadosTipoExame --> ValidarCodigo{Código já<br/>existe?}
    ValidarCodigo -->|Sim| ErroCodigo[Exibir Erro:<br/>Código duplicado]
    ErroCodigo --> DadosTipoExame
    ValidarCodigo -->|Não| ParametrosExame[/Parâmetros do Exame,<br/>Valores de Referência,<br/>Unidades de Medida/]
    ParametrosExame --> PreparoExame[/Instruções de Preparo,<br/>Jejum necessário,<br/>Restrições/]
    PreparoExame --> TempoResultado[/Tempo Estimado<br/>para Resultado/]
    TempoResultado --> ValorExame[/Valor do Exame,<br/>Materiais Necessários/]
    ValorExame --> SalvarTipoExame[(Salvar no<br/>Banco de Dados)]
    SalvarTipoExame --> SucessoTipo[Exibir Mensagem<br/>de Sucesso]

    BuscarTipoExame --> PesquisarTipo[/Nome ou Código<br/>do Exame/]
    PesquisarTipo --> TipoEncontrado{Tipo de Exame<br/>Encontrado?}
    TipoEncontrado -->|Não| NaoEncontradoTipo[Exibir:<br/>Tipo não encontrado]
    NaoEncontradoTipo --> MenuExamesTipo
    TipoEncontrado -->|Sim| EditarTipo[Editar Dados<br/>do Tipo de Exame]
    EditarTipo --> ValidarEdicaoTipo{Dados<br/>Válidos?}
    ValidarEdicaoTipo -->|Não| ErroEdicaoTipo[Exibir Erros]
    ErroEdicaoTipo --> EditarTipo
    ValidarEdicaoTipo -->|Sim| AtualizarTipo[(Atualizar no<br/>Banco de Dados)]
    AtualizarTipo --> SucessoTipo

    BuscarTipoExcluir --> PesquisarTipoExcluir[/Nome ou Código<br/>do Exame/]
    PesquisarTipoExcluir --> TipoExcluirEncontrado{Tipo<br/>Encontrado?}
    TipoExcluirEncontrado -->|Não| NaoEncontradoExcluirTipo[Exibir:<br/>Tipo não encontrado]
    NaoEncontradoExcluirTipo --> MenuExamesTipo
    TipoExcluirEncontrado -->|Sim| VerificarUsoTipo{Tipo está<br/>sendo usado?}
    VerificarUsoTipo -->|Sim| ErroUsoTipo[Exibir: Não é possível<br/>excluir tipo em uso]
    ErroUsoTipo --> MenuExamesTipo
    VerificarUsoTipo -->|Não| ConfirmarExclusaoTipo{Confirmar<br/>Exclusão?}
    ConfirmarExclusaoTipo -->|Não| MenuExamesTipo
    ConfirmarExclusaoTipo -->|Sim| ExcluirTipo[(Excluir do<br/>Banco de Dados)]
    ExcluirTipo --> SucessoTipo

    ConsultarTipos --> FiltrosTipo[/Filtros: Categoria,<br/>Nome, Status/]
    FiltrosTipo --> ListarTipos[Exibir Lista de<br/>Tipos de Exames]
    ListarTipos --> DetalheTipo{Ver Detalhes?}
    DetalheTipo -->|Sim| ExibirParametros[Exibir Parâmetros<br/>e Valores de Referência]
    DetalheTipo -->|Não| MenuExamesTipo
    ExibirParametros --> MenuExamesTipo

    SucessoTipo --> MenuExamesTipo

    style Start fill:#90EE90
    style Fim fill:#FFB6C1
    style SalvarTipoExame fill:#E6E6FA
    style AtualizarTipo fill:#E6E6FA
    style ExcluirTipo fill:#E6E6FA
    style SucessoTipo fill:#98FB98
```

## 6. Fluxograma Detalhado - Agendamento de Exames

```mermaid
flowchart TD
    Start([Início]) --> MenuAgenda[Menu de<br/>Agendamento]

    MenuAgenda --> OpcaoAgenda{Escolher<br/>Opção}

    OpcaoAgenda -->|Novo Agendamento| SelecionarCliente[Selecionar<br/>Cliente]
    OpcaoAgenda -->|Reagendar| BuscarAgendamento[Buscar<br/>Agendamento]
    OpcaoAgenda -->|Cancelar| BuscarCancelar[Buscar para<br/>Cancelar]
    OpcaoAgenda -->|Consultar Agenda| ConsultarAgenda[Visualizar<br/>Agenda]
    OpcaoAgenda -->|Voltar| Fim([Retornar ao<br/>Menu Principal])

    SelecionarCliente --> ClienteCadastrado{Cliente<br/>Cadastrado?}
    ClienteCadastrado -->|Não| CadastroRapido[Cadastro Rápido<br/>de Cliente]
    CadastroRapido --> SelecionarAnimal
    ClienteCadastrado -->|Sim| SelecionarAnimal[Selecionar<br/>Animal]

    SelecionarAnimal --> AnimalCadastrado{Animal<br/>Cadastrado?}
    AnimalCadastrado -->|Não| CadastroAnimalRapido[Cadastro Rápido<br/>de Animal]
    CadastroAnimalRapido --> SelecionarExameTipo
    AnimalCadastrado -->|Sim| SelecionarExameTipo[Selecionar Tipo<br/>de Exame]

    SelecionarExameTipo --> VerificarPreparo{Exame Requer<br/>Preparo?}
    VerificarPreparo -->|Sim| ExibirPreparo[Exibir Instruções<br/>de Preparo]
    VerificarPreparo -->|Não| SelecionarVeterinario
    ExibirPreparo --> ClienteCiente{Cliente Ciente<br/>do Preparo?}
    ClienteCiente -->|Não| CancelarAgenda[Cancelar<br/>Agendamento]
    CancelarAgenda --> MenuAgenda
    ClienteCiente -->|Sim| SelecionarVeterinario[Selecionar<br/>Veterinário]

    SelecionarVeterinario --> VetDisponivel{Veterinário<br/>Disponível?}
    VetDisponivel -->|Não| ListarOutrosVets[Listar Outros<br/>Veterinários]
    ListarOutrosVets --> SelecionarVeterinario
    VetDisponivel -->|Sim| SelecionarData[Selecionar<br/>Data]

    SelecionarData --> VerificarDisponibilidade{Data/Hora<br/>Disponível?}
    VerificarDisponibilidade -->|Não| SugerirHorarios[Sugerir Próximos<br/>Horários Disponíveis]
    SugerirHorarios --> SelecionarData
    VerificarDisponibilidade -->|Sim| ConfirmarAgendamento[Confirmar Dados<br/>do Agendamento]

    ConfirmarAgendamento --> SalvarAgendamento[(Salvar<br/>Agendamento)]
    SalvarAgendamento --> GerarProtocolo[Gerar Número<br/>de Protocolo]
    GerarProtocolo --> EnviarConfirmacao{Enviar<br/>Confirmação?}
    EnviarConfirmacao -->|Sim| EnviarEmail[Enviar Email/SMS<br/>de Confirmação]
    EnviarConfirmacao -->|Não| ExibirProtocolo
    EnviarEmail --> ExibirProtocolo[Exibir Protocolo<br/>e Detalhes]
    ExibirProtocolo --> MenuAgenda

    BuscarAgendamento --> PesquisarAgenda[/Protocolo ou<br/>Nome do Cliente/]
    PesquisarAgenda --> AgendaEncontrada{Agendamento<br/>Encontrado?}
    AgendaEncontrada -->|Não| NaoEncontradoAgenda[Exibir:<br/>Não encontrado]
    NaoEncontradoAgenda --> MenuAgenda
    AgendaEncontrada -->|Sim| AlterarData[Alterar Data/<br/>Horário]
    AlterarData --> VerificarNovaData{Nova Data<br/>Disponível?}
    VerificarNovaData -->|Não| SugerirNovasOpcoes[Sugerir Outras<br/>Opções]
    SugerirNovasOpcoes --> AlterarData
    VerificarNovaData -->|Sim| AtualizarAgenda[(Atualizar<br/>Agendamento)]
    AtualizarAgenda --> NotificarAlteracao[Notificar Cliente<br/>da Alteração]
    NotificarAlteracao --> MenuAgenda

    BuscarCancelar --> PesquisarCancelar[/Protocolo ou<br/>Nome/]
    PesquisarCancelar --> CancelarEncontrado{Agendamento<br/>Encontrado?}
    CancelarEncontrado -->|Não| NaoEncontradoCancelar[Exibir:<br/>Não encontrado]
    NaoEncontradoCancelar --> MenuAgenda
    CancelarEncontrado -->|Sim| MotivoCancelamento[/Registrar Motivo<br/>do Cancelamento/]
    MotivoCancelamento --> ConfirmarCancelamento{Confirmar<br/>Cancelamento?}
    ConfirmarCancelamento -->|Não| MenuAgenda
    ConfirmarCancelamento -->|Sim| CancelarBD[(Cancelar no<br/>Banco de Dados)]
    CancelarBD --> LiberarHorario[Liberar Horário<br/>na Agenda]
    LiberarHorario --> NotificarCancelamento[Notificar<br/>Cancelamento]
    NotificarCancelamento --> MenuAgenda

    ConsultarAgenda --> FiltrosAgenda[/Filtros: Data,<br/>Veterinário,<br/>Tipo de Exame/]
    FiltrosAgenda --> ExibirCalendario[Exibir Calendário<br/>com Agendamentos]
    ExibirCalendario --> DetalheAgenda{Ver Detalhes?}
    DetalheAgenda -->|Sim| ExibirDetalhesAgenda[Exibir Informações<br/>Completas]
    DetalheAgenda -->|Não| MenuAgenda
    ExibirDetalhesAgenda --> MenuAgenda

    style Start fill:#90EE90
    style Fim fill:#FFB6C1
    style SalvarAgendamento fill:#E6E6FA
    style AtualizarAgenda fill:#E6E6FA
    style CancelarBD fill:#E6E6FA
    style GerarProtocolo fill:#98FB98
```

## 7. Fluxograma Detalhado - Realização de Exames

```mermaid
flowchart TD
    Start([Início]) --> MenuRealizacao[Menu Realização<br/>de Exames]

    MenuRealizacao --> OpcaoRealizacao{Escolher<br/>Opção}

    OpcaoRealizacao -->|Iniciar Exame| ListarAgendados[Listar Exames<br/>Agendados Hoje]
    OpcaoRealizacao -->|Exame Urgente| ExameUrgente[Criar Exame<br/>Urgente]
    OpcaoRealizacao -->|Em Andamento| ListarAndamento[Listar Exames<br/>em Andamento]
    OpcaoRealizacao -->|Voltar| Fim([Retornar ao<br/>Menu Principal])

    ListarAgendados --> SelecionarExame[Selecionar Exame<br/>da Lista]
    SelecionarExame --> VerificarCheckin{Animal fez<br/>Check-in?}
    VerificarCheckin -->|Não| RegistrarCheckin[Registrar<br/>Check-in]
    RegistrarCheckin --> ConfirmarPreparo
    VerificarCheckin -->|Sim| ConfirmarPreparo{Confirmar<br/>Preparo OK?}

    ConfirmarPreparo -->|Não| RegistrarProblema[Registrar Problema<br/>de Preparo]
    RegistrarProblema --> Remarcar{Remarcar<br/>Exame?}
    Remarcar -->|Sim| RemarcaAgenda[Ir para<br/>Reagendamento]
    Remarcar -->|Não| MenuRealizacao
    RemarcaAgenda --> MenuRealizacao

    ConfirmarPreparo -->|Sim| IniciarExame[Iniciar<br/>Exame]
    IniciarExame --> RegistrarHoraInicio[(Registrar Hora<br/>de Início)]
    RegistrarHoraInicio --> ColetarAmostra[Coletar<br/>Amostra]

    ColetarAmostra --> IdentificarAmostra[Identificar Amostra<br/>com Código]
    IdentificarAmostra --> RegistrarColeta[Registrar Dados<br/>da Coleta]
    RegistrarColeta --> QualidadeAmostra{Amostra<br/>Adequada?}

    QualidadeAmostra -->|Não| NovaColeta{Possível Nova<br/>Coleta?}
    NovaColeta -->|Sim| ColetarAmostra
    NovaColeta -->|Não| CancelarExame[Cancelar<br/>Exame]
    CancelarExame --> RegistrarMotivo[Registrar Motivo<br/>do Cancelamento]
    RegistrarMotivo --> MenuRealizacao

    QualidadeAmostra -->|Sim| ProcessarExame[Processar<br/>Exame]
    ProcessarExame --> TipoProcessamento{Tipo de<br/>Exame}

    TipoProcessamento -->|Laboratorial| EnviarLab[Enviar para<br/>Laboratório]
    TipoProcessamento -->|Imagem| RealizarImagem[Realizar Exame<br/>de Imagem]
    TipoProcessamento -->|Clínico| ExameFisico[Realizar Exame<br/>Físico]

    EnviarLab --> RegistrarEnvio[(Registrar Envio<br/>ao Laboratório)]
    RegistrarEnvio --> StatusPendente[Atualizar Status:<br/>Aguardando Resultado]

    RealizarImagem --> CapturarImagens[Capturar<br/>Imagens]
    CapturarImagens --> ValidarImagens{Imagens<br/>Adequadas?}
    ValidarImagens -->|Não| CapturarImagens
    ValidarImagens -->|Sim| ArmazenarImagens[(Armazenar<br/>Imagens)]
    ArmazenarImagens --> StatusAnalise[Atualizar Status:<br/>Em Análise]

    ExameFisico --> RegistrarMedicoes[Registrar<br/>Medições]
    RegistrarMedicoes --> ObservacoesClinicas[Registrar<br/>Observações]
    ObservacoesClinicas --> StatusConcluido[Atualizar Status:<br/>Concluído]

    ExameUrgente --> DadosUrgencia[/Dados do Animal,<br/>Cliente, Tipo Exame/]
    DadosUrgencia --> JustificativaUrgencia[/Justificativa<br/>da Urgência/]
    JustificativaUrgencia --> VetResponsavel[Selecionar<br/>Veterinário]
    VetResponsavel --> CriarRegistroUrgente[(Criar Registro<br/>de Urgência)]
    CriarRegistroUrgente --> IniciarExame

    ListarAndamento --> ExamesAndamento[Exibir Lista de<br/>Exames em Processo]
    ExamesAndamento --> AtualizarStatus{Atualizar<br/>Status?}
    AtualizarStatus -->|Sim| NovoStatus[Selecionar<br/>Novo Status]
    NovoStatus --> RegistrarAtualizacao[(Atualizar<br/>Status)]
    RegistrarAtualizacao --> MenuRealizacao
    AtualizarStatus -->|Não| MenuRealizacao

    StatusPendente --> NotificarStatus[Notificar Status<br/>ao Cliente]
    StatusAnalise --> NotificarStatus
    StatusConcluido --> NotificarStatus
    NotificarStatus --> MenuRealizacao

    style Start fill:#90EE90
    style Fim fill:#FFB6C1
    style RegistrarHoraInicio fill:#E6E6FA
    style RegistrarEnvio fill:#E6E6FA
    style ArmazenarImagens fill:#E6E6FA
    style CriarRegistroUrgente fill:#E6E6FA
    style RegistrarAtualizacao fill:#E6E6FA
    style StatusConcluido fill:#98FB98
```

## 8. Fluxograma Detalhado - Resultado de Exames

```mermaid
flowchart TD
    Start([Início]) --> MenuResultado[Menu de<br/>Resultados]

    MenuResultado --> OpcaoResultado{Escolher<br/>Opção}

    OpcaoResultado -->|Lançar Resultado| ListarPendentes[Listar Exames<br/>Pendentes]
    OpcaoResultado -->|Consultar| ConsultarResultados[Consultar<br/>Resultados]
    OpcaoResultado -->|Imprimir Laudo| BuscarLaudo[Buscar Laudo<br/>para Impressão]
    OpcaoResultado -->|Revisar| ListarRevisao[Listar Resultados<br/>para Revisão]
    OpcaoResultado -->|Voltar| Fim([Retornar ao<br/>Menu Principal])

    ListarPendentes --> SelecionarPendente[Selecionar Exame<br/>Pendente]
    SelecionarPendente --> TipoResultado{Tipo de<br/>Resultado}

    TipoResultado -->|Numérico| InserirValores[Inserir Valores<br/>Numéricos]
    InserirValores --> CompararReferencia[Comparar com<br/>Valores de Referência]
    CompararReferencia --> IdentificarAlteracoes{Valores<br/>Alterados?}
    IdentificarAlteracoes -->|Sim| SinalizarAlteracao[Sinalizar Valores<br/>Alterados]
    IdentificarAlteracoes -->|Não| ProsseguirLaudo
    SinalizarAlteracao --> ProsseguirLaudo

    TipoResultado -->|Descritivo| InserirDescricao[Inserir Descrição<br/>dos Achados]
    InserirDescricao --> ProsseguirLaudo

    TipoResultado -->|Imagem| AnexarImagens[Anexar e Descrever<br/>Imagens]
    AnexarImagens --> MarcarPontos[Marcar Pontos<br/>de Interesse]
    MarcarPontos --> ProsseguirLaudo

    ProsseguirLaudo[Prosseguir com<br/>Laudo] --> InserirConclusao[Inserir Conclusão/<br/>Diagnóstico]
    InserirConclusao --> Recomendacoes[Adicionar<br/>Recomendações]
    Recomendacoes --> AssinarDigital[Assinar<br/>Digitalmente]

    AssinarDigital --> ValidarAssinatura{Assinatura<br/>Válida?}
    ValidarAssinatura -->|Não| ErroAssinatura[Exibir Erro<br/>de Assinatura]
    ErroAssinatura --> AssinarDigital
    ValidarAssinatura -->|Sim| SalvarResultado[(Salvar<br/>Resultado)]

    SalvarResultado --> ResultadoCritico{Resultado<br/>Crítico?}
    ResultadoCritico -->|Sim| NotificacaoUrgente[Enviar Notificação<br/>Urgente]
    ResultadoCritico -->|Não| NotificacaoNormal[Enviar Notificação<br/>Normal]
    NotificacaoUrgente --> GerarLaudo
    NotificacaoNormal --> GerarLaudo

    GerarLaudo[Gerar Laudo<br/>em PDF] --> DisponibilizarResultado[(Disponibilizar<br/>no Sistema)]
    DisponibilizarResultado --> MenuResultado

    ConsultarResultados --> FiltrosResultado[/Filtros: Paciente,<br/>Data, Tipo Exame,<br/>Veterinário/]
    FiltrosResultado --> ListarResultados[Exibir Lista<br/>de Resultados]
    ListarResultados --> VisualizarResultado{Visualizar<br/>Resultado?}
    VisualizarResultado -->|Sim| ExibirResultadoCompleto[Exibir Resultado<br/>Completo]
    ExibirResultadoCompleto --> OpcoesResultado{Opções}
    OpcoesResultado -->|Imprimir| ImprimirResultado
    OpcoesResultado -->|Enviar| EnviarResultado
    OpcoesResultado -->|Voltar| MenuResultado
    VisualizarResultado -->|Não| MenuResultado

    BuscarLaudo --> PesquisarLaudo[/Protocolo ou<br/>Nome do Paciente/]
    PesquisarLaudo --> LaudoEncontrado{Laudo<br/>Encontrado?}
    LaudoEncontrado -->|Não| NaoEncontradoLaudo[Exibir:<br/>Laudo não encontrado]
    NaoEncontradoLaudo --> MenuResultado
    LaudoEncontrado -->|Sim| VisualizarLaudo[Visualizar<br/>Laudo]
    VisualizarLaudo --> ConfigImpressao[Configurar<br/>Impressão]
    ConfigImpressao --> ImprimirResultado[Imprimir<br/>Laudo]
    ImprimirResultado --> RegistrarImpressao[(Registrar<br/>Impressão)]
    RegistrarImpressao --> MenuResultado

    EnviarResultado --> MetodoEnvio{Método de<br/>Envio}
    MetodoEnvio -->|Email| EnviarEmail[Enviar por<br/>Email]
    MetodoEnvio -->|WhatsApp| EnviarWhatsApp[Enviar por<br/>WhatsApp]
    MetodoEnvio -->|Portal| DisponibilizarPortal[Disponibilizar<br/>no Portal]
    EnviarEmail --> RegistrarEnvio[(Registrar<br/>Envio)]
    EnviarWhatsApp --> RegistrarEnvio
    DisponibilizarPortal --> RegistrarEnvio
    RegistrarEnvio --> MenuResultado

    ListarRevisao --> SelecionarRevisao[Selecionar Resultado<br/>para Revisão]
    SelecionarRevisao --> RevisarDados[Revisar Dados<br/>e Valores]
    RevisarDados --> AlteracaoNecessaria{Necessita<br/>Alteração?}
    AlteracaoNecessaria -->|Sim| EditarResultado[Editar<br/>Resultado]
    EditarResultado --> JustificarAlteracao[Justificar<br/>Alteração]
    JustificarAlteracao --> SalvarRevisao[(Salvar<br/>Revisão)]
    SalvarRevisao --> NotificarRevisao[Notificar sobre<br/>Revisão]
    NotificarRevisao --> MenuResultado
    AlteracaoNecessaria -->|Não| AprovarResultado[Aprovar<br/>Resultado]
    AprovarResultado --> MenuResultado

    style Start fill:#90EE90
    style Fim fill:#FFB6C1
    style SalvarResultado fill:#E6E6FA
    style DisponibilizarResultado fill:#E6E6FA
    style RegistrarImpressao fill:#E6E6FA
    style RegistrarEnvio fill:#E6E6FA
    style SalvarRevisao fill:#E6E6FA
    style GerarLaudo fill:#98FB98
```

## Legendas

### Cores utilizadas:

- 🟢 **Verde claro** (#90EE90): Início do processo
- 🔴 **Rosa claro** (#FFB6C1): Fim do processo
- 🔵 **Azul claro** (#87CEEB): Menu principal
- 🟡 **Amarelo claro** (#FFE4B5): Módulos principais
- 🟣 **Lavanda** (#E6E6FA): Operações de banco de dados
- 🟢 **Verde menta** (#98FB98): Operações bem-sucedidas

### Símbolos:

- **Retângulo**: Processo/Ação
- **Losango**: Decisão
- **Retângulo arredondado**: Início/Fim
- **Paralelogramo** (/texto/): Entrada de dados
- **Cilindro** [(texto)]: Operação de banco de dados
