# Script para configurar o app Android
Write-Host "🚀 Configurando Condomínio Conectado para Android..." -ForegroundColor Green

# Verificar se Node.js está instalado
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js não encontrado. Instale Node.js primeiro." -ForegroundColor Red
    exit 1
}

# Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install

# Fazer build do projeto
Write-Host "🔨 Fazendo build do projeto..." -ForegroundColor Yellow
npm run build

# Verificar se a pasta android já existe
if (Test-Path "android") {
    Write-Host "📱 Plataforma Android já existe. Sincronizando..." -ForegroundColor Yellow
    npm run android:sync
} else {
    Write-Host "📱 Adicionando plataforma Android..." -ForegroundColor Yellow
    npm run android:add
    npm run android:sync
}

# Abrir Android Studio
Write-Host "🎯 Abrindo Android Studio..." -ForegroundColor Green
npm run android:open

Write-Host "✅ Configuração concluída!" -ForegroundColor Green
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Aguarde o Android Studio carregar o projeto" -ForegroundColor White
Write-Host "   2. Configure um emulador ou conecte um dispositivo" -ForegroundColor White
Write-Host "   3. Clique no botão Run (▶️) para executar o app" -ForegroundColor White
Write-Host "   4. Para mudanças futuras, use: npm run android:run" -ForegroundColor White