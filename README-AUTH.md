# Sistema de Autenticação - Condomínio Conectado

## 📋 Visão Geral

Este sistema implementa um completo sistema de login e registro para o aplicativo "Condomínio Conectado" com todas as funcionalidades de segurança solicitadas.

## ✨ Funcionalidades Implementadas

### 🔐 Cadastro de Usuário
- ✅ Campo "Email" obrigatório com validação de formato
- ✅ Campo "Senha" com mínimo de 6 caracteres
- ✅ Envio automático de código de confirmação de 6 dígitos por email
- ✅ Validação do código antes de finalizar o cadastro
- ✅ Senhas criptografadas automaticamente pelo Supabase

### 🚪 Login
- ✅ Login com email e senha
- ✅ Bloqueio de login para emails não confirmados
- ✅ Sistema de limitação de tentativas (3 tentativas máximas)
- ✅ Bloqueio temporário de 15 minutos após muitas tentativas falhas

### 🔒 Segurança
- ✅ Proteção contra ataques de força bruta
- ✅ Redefinição de senha via email
- ✅ Row Level Security (RLS) habilitado em todas as tabelas
- ✅ Políticas de acesso específicas por tipo de usuário

### 🎯 Funcionalidades
- ✅ Acesso normal às funções do app após login
- ✅ Permissões diferenciadas para administradores e síndicos
- ✅ Sistema de perfis de usuário
- ✅ Logout seguro

## 📁 Estrutura dos Arquivos

```
lib/
├── auth.js                 # Funções centrais de autenticação
contexts/
├── AuthContext.jsx         # Context para gerenciamento de estado
components/
├── SignUpForm.jsx          # Formulário de registro
├── SignInForm.jsx          # Formulário de login
├── AuthModal.jsx           # Modal combinado de login/registro
├── ProtectedRoute.jsx      # Componente para rotas protegidas
└── UserHeader.jsx          # Cabeçalho com informações do usuário
scripts/
└── setup-auth-policies.sql # Script de configuração do banco
```

## 🚀 Como Usar

### 1. Configuração do Banco de Dados

**SOLUÇÃO PARA ERROS**: Use a abordagem em 2 etapas:

#### Etapa 1: Configuração Básica (OBRIGATÓRIO)
Execute o script `scripts/setup-auth-minimal.sql` no SQL Editor do Supabase:

```sql
-- Este script irá configurar:
-- - Tabelas user_roles e profiles usando TEXT
-- - Row Level Security básico
-- - Trigger para criação automática de perfil
-- - Função para associar novos usuários como "moradores"
```

#### Etapa 2: Políticas Avançadas (OPCIONAL)
Após a Etapa 1 funcionar, execute `scripts/setup-additional-policies.sql`:

```sql
-- Este script adiciona:
-- - Políticas para comunicados, encomendas, etc.
-- - Permissões diferenciadas por tipo de usuário
```

**⚠️ Importante**: Execute sempre a Etapa 1 primeiro! Só faça a Etapa 2 se a Etapa 1 funcionar sem erros.

### 2. Implementação na Aplicação

#### Envolver a aplicação com o AuthProvider:

```jsx
import { AuthProvider } from './contexts/AuthContext';
import UserHeader from './components/UserHeader';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <UserHeader />
        {/* Resto da aplicação */}
      </div>
    </AuthProvider>
  );
}
```

#### Proteger rotas específicas:

```jsx
import ProtectedRoute from './components/ProtectedRoute';

function AdminPanel() {
  return (
    <ProtectedRoute requiredPermission="admin">
      <div>Conteúdo apenas para administradores</div>
    </ProtectedRoute>
  );
}

function Dashboard() {
  return (
    <ProtectedRoute>
      <div>Conteúdo para usuários logados</div>
    </ProtectedRoute>
  );
}
```

#### Usar o modal de autenticação:

```jsx
import AuthModal from './components/AuthModal';

function HomePage() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div>
      <button onClick={() => setShowAuth(true)}>
        Login
      </button>
      
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => {
            setShowAuth(false);
            // Redirecionar ou atualizar estado
          }}
        />
      )}
    </div>
  );
}
```

### 3. Usando o Hook de Autenticação

```jsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, userRole, isAdmin, isSindico, logout } = useAuth();

  if (!user) {
    return <div>Você precisa estar logado</div>;
  }

  return (
    <div>
      <p>Bem-vindo, {user.email}!</p>
      <p>Seu papel: {userRole?.role}</p>
      
      {isAdmin() && (
        <button>Funcionalidade de Admin</button>
      )}
      
      {isSindico() && (
        <button>Funcionalidade de Síndico</button>
      )}
      
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

## 🛡️ Sistema de Permissões

### Tipos de Usuário
- **Morador**: Usuário padrão, acesso básico
- **Síndico**: Permissões administrativas do condomínio
- **Admin**: Acesso total ao sistema

### Permissões por Funcionalidade
```javascript
// Permissões dos moradores
const moradorPermissions = [
  'view_comunicados',        // Ver comunicados
  'view_coleta_lixo',        // Ver horários de coleta
  'view_encomendas',         // Ver suas encomendas
  'create_sugestoes',        // Criar sugestões
  'view_servicos',           // Ver serviços disponíveis
  'create_classificados',    // Criar anúncios classificados
  'create_agendamentos'      // Agendar salão de festas
];

// Síndicos e Admins têm todas as permissões acima + administrativas
```

## 🔐 Segurança Implementada

### Limitação de Tentativas de Login
- Máximo de 3 tentativas por sessão
- Bloqueio por 15 minutos após esgotar tentativas
- Contador persiste no localStorage
- Reset automático após login bem-sucedido

### Row Level Security (RLS)
- Habilitado em todas as tabelas
- Usuários só veem seus próprios dados
- Administradores têm acesso completo
- Políticas específicas por funcionalidade

### Validações
- Email: Formato válido obrigatório
- Senha: Mínimo de 6 caracteres
- Código OTP: Exatamente 6 dígitos numéricos

## 📧 Configuração de Email

O sistema usa as configurações padrão do Supabase para envio de emails. Para produção, configure:

1. No painel do Supabase, vá para Authentication → Settings
2. Configure seu provedor de email (SMTP)
3. Personalize os templates de email
4. Atualize as URLs de redirecionamento

## 🎨 Estilos

Os componentes usam Tailwind CSS. Classes principais:
- Formulários: `max-w-md mx-auto bg-white p-8 rounded-lg shadow-md`
- Botões: `bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600`
- Alertas: `bg-red-100 border border-red-400 text-red-700 rounded`

## 🚨 Troubleshooting

### Problemas Comuns

1. **Email não chegou**
   - Verifique spam/lixo eletrônico
   - Confirme configuração SMTP no Supabase

2. **Erro de permissão**
   - Execute o script `setup-auth-policies.sql`
   - Verifique se RLS está habilitado

3. **Bloqueio de login**
   - Aguarde 15 minutos ou limpe localStorage
   - Use "Esqueci minha senha" se necessário

### Reset Manual
Para resetar tentativas de login manualmente:
```javascript
localStorage.removeItem('loginAttempts');
localStorage.removeItem('loginLockoutEndTime');
```

## 📝 Próximos Passos

1. **Página de perfil**: Permitir edição de dados pessoais
2. **Painel administrativo**: Interface para gerenciar usuários
3. **Logs de auditoria**: Registrar ações importantes
4. **Autenticação 2FA**: Implementar segundo fator
5. **Social login**: Integrar login com Google/Facebook

## 🤝 Contribuindo

Para contribuir com melhorias:
1. Faça fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

---

**⚠️ Importante**: Execute sempre o script `setup-auth-policies.sql` antes de usar o sistema em produção para garantir que todas as políticas de segurança estejam configuradas corretamente.
