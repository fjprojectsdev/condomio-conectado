# Configurar JAVA_HOME
$javaPath = "C:\Program Files\Android\Android Studio\jbr"
if (Test-Path $javaPath) {
    [Environment]::SetEnvironmentVariable("JAVA_HOME", $javaPath, "User")
    $env:JAVA_HOME = $javaPath
    Write-Host "JAVA_HOME configurado: $javaPath" -ForegroundColor Green
} else {
    Write-Host "Java não encontrado. Instale Android Studio primeiro." -ForegroundColor Red
}