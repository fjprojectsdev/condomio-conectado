# Guia: Transformar Web App em App Android

## Pré-requisitos

1. **Android Studio** instalado
2. **Java JDK 17** ou superior
3. **Node.js** e **npm** instalados

## Passo a Passo

### 1. Preparar o Projeto

```bash
# No terminal, navegue até a pasta do projeto
cd C:\Users\55699\condomio-conectado

# Instale as dependências (se ainda não instalou)
npm install

# Faça o build do projeto
npm run build
```

### 2. Adicionar Plataforma Android

```bash
# Adicionar a plataforma Android (só precisa fazer uma vez)
npm run android:add
```

### 3. Sincronizar e Abrir no Android Studio

```bash
# Sincronizar o projeto e abrir no Android Studio
npm run android:sync
npm run android:open
```

### 4. Configurar no Android Studio

1. **Aguarde** o Android Studio indexar o projeto
2. **Configure um emulador** ou conecte um dispositivo físico
3. **Execute o app** clicando no botão "Run" (▶️)

### 5. Para Desenvolvimento Contínuo

Sempre que fizer mudanças no código web:

```bash
# Rebuilda e sincroniza com Android
npm run android:run
```

## Configurações Importantes

### Permissões (android/app/src/main/AndroidManifest.xml)

O Capacitor já adiciona as permissões básicas, mas você pode adicionar mais se necessário:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### Ícone do App

1. Coloque seus ícones em `android/app/src/main/res/mipmap-*/`
2. Ou use o Android Studio: `File > New > Image Asset`

### Nome do App

Edite `android/app/src/main/res/values/strings.xml`:

```xml
<string name="app_name">Condomínio Conectado</string>
```

## Comandos Úteis

```bash
# Apenas sincronizar (sem abrir Android Studio)
npx cap sync android

# Executar no dispositivo/emulador
npx cap run android

# Abrir Android Studio
npx cap open android

# Ver logs do dispositivo
npx cap run android --livereload
```

## Solução de Problemas

### Erro de Java/JDK
- Certifique-se de ter JDK 17+ instalado
- Configure JAVA_HOME nas variáveis de ambiente

### Erro de Android SDK
- Abra Android Studio
- Vá em Tools > SDK Manager
- Instale Android SDK Platform-Tools

### App não atualiza
- Execute `npm run build` antes de `npx cap sync`
- Limpe o cache: Build > Clean Project no Android Studio

## Gerar APK para Distribuição

1. No Android Studio: `Build > Generate Signed Bundle/APK`
2. Escolha APK
3. Crie uma keystore (primeira vez) ou use existente
4. Escolha "release"
5. O APK será gerado em `android/app/build/outputs/apk/release/`

## Próximos Passos

- Configure ícones personalizados
- Adicione splash screen
- Configure deep links se necessário
- Teste em diferentes dispositivos
- Publique na Google Play Store