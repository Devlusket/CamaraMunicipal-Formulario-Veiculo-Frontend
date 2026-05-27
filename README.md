# Câmara Municipal — Frontend de Controle de Veículos

Interface web desenvolvida com Angular 21 para o sistema de gerenciamento de uso e agendamento dos veículos institucionais da câmara municipal. Funcionários registram o uso dos veículos (com assinatura digital) e realizam agendamentos diretamente pelo navegador ou pelo app instalado via PWA, enquanto o admin tem acesso a um painel completo com histórico, gestão de veículos e geração de relatórios em PDF.

**Frontend em produção:** `https://camara-municipal-medina-veiculos.vercel.app`  
**API (Swagger):** `https://camaramunicipal-formulario-veiculo.onrender.com/swagger-ui/index.html`  
**Repositório do backend:** `https://github.com/Devlusket/CamaraMunicipal-Formulario-Veiculo`

---

## Tecnologias

- **Angular 21** — framework principal com Standalone Components
- **Tailwind CSS v4** — estilização utilitária via `@theme` no `styles.css`
- **TypeScript** — tipagem estrita com interfaces espelhando os DTOs do backend
- **Angular Signals** — gerenciamento de estado reativo (`signal`, `computed`)
- **Angular PWA** (`@angular/pwa`) — service worker para instalação como app no celular com atualização automática
- **signature_pad 5.x** — captura de assinatura digital via canvas (mouse e touch)
- **RxJS** — operadores reativos para chamadas HTTP e interceptors
- **Vercel** — deploy do frontend em produção

---

## Arquitetura

O projeto segue arquitetura feature-based com lazy loading em todas as rotas:

```
src/app/
├── core/
│   ├── services/       # VeiculoService, FormularioService, AgendamentoService,
│   │                   # RelatorioService, AuthService, ToastService
│   ├── interceptors/   # AuthInterceptor (Basic Auth), ErrorInterceptor
│   ├── guards/         # AuthGuard (proteção das rotas /admin)
│   └── models/         # Interfaces TypeScript espelhando os DTOs do backend
├── shared/
│   └── components/     # Navbar, Footer, Toast, LoadingSpinner, ConfirmModal,
│                       # SignaturePad
└── features/
    ├── public/
    │   ├── formulario/  # Página de formulário de uso (/formulario)
    │   └── agendamento/ # Página de agendamento (/agendamento)
    └── admin/
        ├── login/       # Tela de login admin (/admin/login)
        ├── layout/      # Sidebar compartilhada entre todas as páginas admin
        ├── dashboard/   # Painel com cards de resumo (/admin/dashboard)
        ├── veiculos/    # CRUD de veículos (/admin/veiculos)
        ├── formularios/ # Listagem de formulários com assinatura (/admin/formularios)
        ├── agendamentos/# Listagem e cancelamento de agendamentos (/admin/agendamentos)
        └── relatorios/  # Download de relatório PDF (/admin/relatorios)
```

---

## Perfis de Acesso

| Funcionalidade | Público | Admin |
|---|---|---|
| Preencher formulário de uso (com assinatura) | ✅ | ✅ |
| Criar agendamento | ✅ | ✅ |
| Verificar disponibilidade | ✅ | ✅ |
| Ver agendamentos futuros ativos | ✅ | ✅ |
| Cancelar agendamento | ❌ | ✅ |
| Listar todos os formulários (com assinatura) | ❌ | ✅ |
| Listar todos os agendamentos | ❌ | ✅ |
| Gerenciar veículos (CRUD) | ❌ | ✅ |
| Gerar relatório PDF | ❌ | ✅ |

---

## Regras de Negócio (Frontend)

### Área Pública
- Qualquer pessoa com o link acessa — sem autenticação
- O link é distribuído apenas entre funcionários da câmara
- O formulário de uso carrega automaticamente os veículos ativos
- A **assinatura digital é obrigatória** — o formulário não é enviado sem ela
- O agendamento exige verificação de disponibilidade antes de confirmar
- Agendamentos futuros filtram automaticamente registros expirados e cancelados — apenas ativos com `dataFim > agora` são exibidos
- Agendamentos futuros podem ser visualizados mas **não cancelados** — cancelamento é responsabilidade do admin
- Se o backend demorar mais de 5 segundos para responder (cold start do Render), um banner amarelo é exibido orientando o usuário a aguardar

### Área Admin
- Acesso via `/admin/login` — link discreto no rodapé de todas as páginas públicas
- Autenticação via HTTP Basic — credenciais mantidas **em memória** durante a sessão
- Recarregar a página encerra a sessão (intencional — sem localStorage por segurança)
- Cold start tratado na tela de login — aviso aparece após 5 segundos sem resposta
- Cancelamento de agendamentos disponível apenas aqui
- Agendamentos cancelados e expirados ocultos por padrão — toggles independentes para exibir cada grupo
- Listagens ordenadas por **mais recente no topo** em formulários e agendamentos
- Assinatura digital visível nos detalhes expansíveis de cada formulário

---

## Assinatura Digital

O componente `SignaturePadComponent` encapsula o `signature_pad` e expõe um `EventEmitter` com o base64 da imagem:

- Funciona com **mouse no desktop** e **toque no mobile**
- Canvas ajustado automaticamente ao `devicePixelRatio` para nitidez em telas Retina
- Traço em azul institucional (`rgb(30, 58, 138)`) sobre fundo branco
- Botão "Limpar assinatura" aparece apenas após o primeiro traço
- Após submit bem-sucedido, o canvas é limpo programaticamente via `ViewChild`
- A assinatura é enviada como `data:image/png;base64,...` e armazenada em campo `TEXT` no banco

---

## Como executar localmente

### Pré-requisitos

- Node.js 20+
- pnpm (ou npm)
- Backend rodando localmente ou apontando para produção

### 1. Clone o repositório

```bash
git clone https://github.com/Devlusket/camara-veiculo-frontend.git
cd camara-veiculo-frontend
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure o ambiente

O arquivo `src/environments/environment.ts` já aponta para `http://localhost:8080` por padrão. Para apontar para a API em produção durante desenvolvimento, edite:

```ts
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://camaramunicipal-formulario-veiculo.onrender.com',
};
```

### 4. Suba o servidor de desenvolvimento

```bash
ng serve
```

Acesse em `http://localhost:4200`.

### Comandos úteis

```bash
ng serve                             # sobe o servidor de desenvolvimento
ng build                             # build de desenvolvimento
ng build --configuration production  # build de produção
ng test                              # roda os testes unitários
```

---

## Deploy (Vercel)

O frontend está hospedado na **Vercel**. O deploy é automático via GitHub — qualquer push na branch `main` dispara um novo deploy.

### Configuração necessária

O arquivo `vercel.json` na raiz garante que o roteamento do Angular funcione corretamente em produção (evita 404 ao acessar rotas diretamente):

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Não há variáveis de ambiente necessárias no Vercel — a `apiUrl` de produção está hardcoded no `environment.prod.ts`.

### Infraestrutura completa

| Serviço | Plataforma | Observação |
|---|---|---|
| Frontend (Angular) | Vercel | Plano gratuito — sempre disponível |
| Backend (Spring Boot) | Render | Plano gratuito — dorme após 15min de inatividade |
| Banco de dados (PostgreSQL) | Neon | Plano gratuito — sempre disponível |

> No plano gratuito do Render, a primeira requisição após inatividade pode demorar **30-50 segundos**. O frontend exibe um banner informativo após 5 segundos de espera — isso é esperado e não indica erro.

---

## PWA — Instalação como App

O sistema suporta instalação como Progressive Web App em dispositivos móveis e desktop.

- **Nome do app:** CM Veículos
- **Cor do tema:** Azul institucional (`#1e3a8a`)
- **Modo de exibição:** Standalone (sem barra do navegador)
- **Atualização automática:** quando uma nova versão é detectada, o usuário vê um `confirm` perguntando se deseja atualizar — sem necessidade de reinstalar o app
- **Ícones:** Gerados automaticamente pelo `@angular/pwa` — substituir pelos ícones oficiais da câmara quando disponíveis

---

## Autenticação Admin

O sistema usa **HTTP Basic Auth** herdado diretamente do backend — sem JWT, sem refresh token, sem localStorage.

### Fluxo

1. Admin acessa `/admin/login` (link no rodapé das páginas públicas)
2. Insere usuário e senha
3. O `AuthService` faz uma requisição de validação para `/api/admin/veiculos`
4. Se bem-sucedido, as credenciais ficam **em memória** no `AuthService`
5. O `AuthInterceptor` injeta o header `Authorization: Basic <base64>` em todas as requisições para `/api/admin/**`
6. O `AuthGuard` protege todas as rotas sob `/admin` exceto `/admin/login`
7. Ao sair ou recarregar a página, as credenciais são limpas automaticamente

### Por que não JWT?

O sistema tem um único usuário admin com credenciais fixas. JWT seria overengineering para esse escopo — HTTP Basic com credenciais em memória entrega a segurança necessária com zero complexidade extra.

---

## Decisões Técnicas

- **Angular Signals ao invés de BehaviorSubject** — API moderna do Angular, mais simples e sem necessidade de `subscribe` manual para estados derivados via `computed()`
- **Standalone Components** — sem `NgModule`, cada componente declara suas próprias dependências nos `imports`
- **Lazy loading em todas as rotas** — cada feature é carregada sob demanda, reduzindo o bundle inicial
- **Credenciais admin em memória** — nunca persistidas em `localStorage` ou `sessionStorage` por segurança
- **Cancelamento de agendamento apenas pelo admin** — evita que um funcionário cancele o agendamento de outro; ownership por usuário foi descartado por ser overengineering para o escopo
- **Assinatura via canvas (signature_pad)** — solução client-side sem dependência de API externa; base64 enviado diretamente ao backend e armazenado em campo TEXT
- **`computed()` para filtros** — filtros client-side recalculam automaticamente quando os signals mudam, sem nenhum `subscribe` manual
- **Filtro de expirados client-side** — agendamentos com `dataFim < agora` filtrados no frontend sem necessidade de novo status no backend
- **Estratégia híbrida mobile/desktop nas tabelas admin** — tabelas tradicionais em `lg:block` e cards empilhados em `lg:hidden`
- **Cold start handler** — timer de 5 segundos detecta lentidão do Render e exibe banner informativo tanto nas páginas públicas quanto no login admin
- **PWA com atualização automática via SwUpdate** — `versionUpdates` detecta nova versão e exibe `confirm` para o usuário recarregar
- **PDF download via Blob** — `URL.createObjectURL` + `<a>` programático dispara o download sem abrir nova aba

---

## Estrutura de Models (TypeScript)

Os models espelham os DTOs do backend:

```ts
// Veículo
VeiculoResponseDTO  — id, nome, placa, ativo, createdAt
VeiculoRequestDTO   — nome, placa

// Formulário
FormularioRequestDTO  — requisitante, cargo, veiculoId, dataSaida,
                        dataRetornoPrevista, itinerario, justificativa,
                        odometroSaida, observacao?, assinatura
FormularioResponseDTO — + id, veiculoNome, assinatura?, createdAt

// Agendamento
AgendamentoRequestDTO  — requisitante, cargo, veiculoId, dataInicio, dataFim
AgendamentoResponseDTO — + id, veiculoNome, status, createdAt
StatusAgendamento      — 'ATIVO' | 'CANCELADO'

// Disponibilidade
DisponibilidadeResponseDTO — disponivel, mensagem

// Auth
Credenciais — username, password
```

---

## Desenvolvido por

**Lucas Soares** — Desenvolvedor Backend Java/Spring Boot  
[LinkedIn](https://www.linkedin.com/in/devlusket) · [Portfólio](https://lucas-soares-portfolio.vercel.app)
---