# Vehicle Reservation Interface

## Visão Geral

Esta aplicação web permite aos usuários gerenciar reservas de veículos e inventário, com autenticação de usuários, gerenciamento de perfil e administração de veículos.

## Tecnologias

- **Angular 18.2.0** - Framework principal
- **TypeScript 5.5.2** - Linguagem de programação
- **SCSS** - Pré-processador CSS

## Funcionalidades

### Autenticação
- Login com email e senha
- Registro de novos usuários com validação
- Recuperação de senha
- Gerenciamento de sessão via cookies

### Reservas
- Criar reservas com seleção de datas
- Listar reservas com filtros e busca
- Cancelar reservas pendentes
- Completar reservas ativas
- Status: PENDING, ACTIVE, COMPLETED, CANCELLED

### Veículos
- Cadastro de novos veículos
- Listagem com preview de imagens
- Edição de detalhes (nome, ano, tipo, motor, tamanho)
- Exclusão de veículos
- Controle de disponibilidade
- Filtros por tipo, motor e tamanho

### Perfil de Usuário
- Edição de dados pessoais
- Alteração de senha
- Exclusão de conta

## Estrutura do Projeto

```
src/
├── app/
│   ├── core/                    # Funcionalidades centrais
│   │   ├── guards/             # Proteção de rotas (auth, noAuth)
│   │   ├── interceptors/       # Interceptors HTTP
│   │   ├── models/             # Modelos de dados
│   │   └── services/           # Serviços de negócio
│   ├── features/               # Módulos de funcionalidades
│   │   ├── auth/               # Autenticação (Login, Registro)
│   │   ├── reservations/       # Gerenciamento de reservas
│   │   ├── vehicles/           # Gerenciamento de veículos
│   │   └── profile/            # Perfil do usuário
│   ├── shared/                 # Componentes compartilhados
│   │   ├── components/         # Componentes reutilizáveis
│   │   └── utils/              # Funções utilitárias
│   └── app.routes.ts           # Definição de rotas
├── styles/                     # Variáveis SCSS globais
└── environments/               # Configurações de ambiente
public/                         # Assets estáticos (imagens)
```

## Componentes Principais

| Componente | Descrição |
|------------|-----------|
| `MainLayoutComponent` | Layout principal com header, sidebar e navegação |
| `VehicleCardComponent` | Card de exibição de veículo |
| `ReservationCardComponent` | Card de exibição de reserva |
| `FilterModalComponent` | Modal de filtros avançados |
| `VehicleModalComponent` | Modal de criação/edição de veículo |
| `ReservationModalComponent` | Wizard de criação de reserva |
| `ConfirmModalComponent` | Modal de confirmação de ações |

## Serviços

| Serviço | Responsabilidade |
|---------|------------------|
| `AuthService` | Autenticação e sessão do usuário |
| `VehicleService` | Operações CRUD de veículos |
| `ReservationService` | Operações CRUD de reservas |
| `UserService` | Gerenciamento de perfil |
| `ToastService` | Exibição de notificações |
| `LoadingService` | Estado de carregamento global |

## Modelos de Dados

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}
```

### Vehicle
```typescript
interface Vehicle {
  id: string;
  name: string;
  year: string;
  type: string;
  engine: string;
  size: number;
  available?: boolean;
  imageUrl?: string;
}
```

### Reservation
```typescript
interface Reservation {
  id: string;
  vehicleId: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  vehicle?: Vehicle;
  user?: User;
}
```

## API

A aplicação consome uma API REST no endereço `http://localhost:3000`.

### Endpoints

| Recurso | Método | Endpoint |
|---------|--------|----------|
| Login | POST | `/auth/login` |
| Registro | POST | `/auth/register` |
| Logout | POST | `/auth/logout` |
| Usuário atual | GET | `/auth/me` |
| Atualizar usuário | PATCH | `/users` |
| Deletar usuário | DELETE | `/users` |
| Listar veículos | GET | `/vehicles` |
| Criar veículo | POST | `/vehicles` |
| Atualizar veículo | PATCH | `/vehicles/{id}` |
| Deletar veículo | DELETE | `/vehicles/{id}` |
| Listar reservas | GET | `/reservations` |
| Criar reserva | POST | `/reservations` |
| Cancelar reserva | PATCH | `/reservations/{id}/cancel` |
| Completar reserva | PATCH | `/reservations/{id}/complete` |

## Instalação

### Pré-requisitos
- Node.js 20.19.6
- npm ou yarn

### Passos

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd vehicle-reservation-interface
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a API backend (certifique-se de que está rodando em `http://localhost:3000`)

4. Inicie o servidor de desenvolvimento:
```bash
ng serve
```

5. Acesse `http://localhost:4200`

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `ng serve` | Inicia o servidor de desenvolvimento |
| `ng build` | Compila o projeto para produção |

## Licença

Este projeto está sob a licença MIT.
