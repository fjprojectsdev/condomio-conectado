# Execute como Administrador para excluir pastas do Windows Defender
Add-MpPreference -ExclusionPath "C:\Users\55699\.gradle"
Add-MpPreference -ExclusionPath "C:\Users\55699\AppData\Local\Android\Sdk"
Add-MpPreference -ExclusionPath "C:\Users\55699\AppData\Local\Google\AndroidStudio2025.1.2"
Add-MpPreference -ExclusionPath "C:\Users\55699\condomio-conectado\android"
Write-Host "Pastas excluídas do Windows Defender" -ForegroundColor Green