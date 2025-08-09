# Condomínio Conectado

## Sobre o Projeto

O **Condomínio Conectado** é uma aplicação web moderna para gerenciamento de condomínios, oferecendo funcionalidades para moradores e administradores.

### Funcionalidades

#### Para Moradores:
- 📦 **Encomendas**: Consulte encomendas recebidas e aguardando retirada
- 🗑️ **Coleta de Lixo**: Veja os dias e horários de coleta por tipo de lixo
- 📢 **Comunicados**: Acesse avisos e informações da administração
- 🔧 **Serviços**: Encontre profissionais disponíveis no condomínio
- 🎉 **Salão de Festas**: Agende o salão para eventos com sistema de aprovação
- 🛍️ **Classificados**: Publique anúncios de compra, venda, doação, troca e serviços

#### Para Administradores:
- ✏️ **Gerenciar Encomendas**: Registrar, editar e marcar encomendas como retiradas
- 📅 **Gerenciar Coleta**: Configurar cronograma de coleta de lixo
- 📝 **Gerenciar Comunicados**: Publicar e editar comunicados
- 👥 **Gerenciar Serviços**: Cadastrar e gerenciar profissionais
- 📆 **Gerenciar Agendamentos**: Aprovar, cancelar e gerenciar reservas do salão
- 🛍️ **Gerenciar Classificados**: Ativar, desativar e moderar anúncios dos moradores

### 📱 Progressive Web App (PWA)
O app agora é um **Progressive Web App** completo:
- 🚀 **Instalação**: Pode ser instalado na tela inicial do dispositivo
- 🌐 **Offline**: Funciona sem conexão com internet (cache inteligente)
- 🔄 **Atualizações**: Atualizações automáticas em segundo plano
- 📱 **Nativo**: Experiência similar a app nativo no celular

**URL do Projeto**: https://lovable.dev/projects/68a5afb8-821c-4be5-ad32-e307bda75d2e

## Configuração

### Acesso Administrativo
Para acessar o painel administrativo, clique em "Acesso Administrativo" na tela inicial e use as credenciais:
- **Senha padrão**: `admin123`

### Configuração Personalizada
Para personalizar a senha administrativa:
1. Copie o arquivo `.env.example` para `.env`
2. Defina a variável `VITE_ADMIN_PASSWORD` com sua senha personalizada
3. Reinicie o servidor de desenvolvimento

### Banco de Dados
O projeto usa Supabase como backend. As configurações de conexão já estão configuradas no código.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/68a5afb8-821c-4be5-ad32-e307bda75d2e) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/68a5afb8-821c-4be5-ad32-e307bda75d2e) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
