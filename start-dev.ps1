#!/usr/bin/env pwsh
Write-Host "🚀 Iniciando servidor de desenvolvimento..." -ForegroundColor Green
Write-Host "📍 URL Local: http://localhost:8080/" -ForegroundColor Cyan
Write-Host "📱 URL Rede: http://192.168.1.7:8080/" -ForegroundColor Cyan
Write-Host "⚡ Para parar o servidor, pressione Ctrl+C" -ForegroundColor Yellow
Write-Host "-------------------------------------------" -ForegroundColor Gray

npm run dev
