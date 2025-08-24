# Recursos para Android

## Ícones Necessários

Para um app Android completo, você precisa dos seguintes ícones:

### Ícones do App (mipmap)
- `mipmap-mdpi/ic_launcher.png` (48x48px)
- `mipmap-hdpi/ic_launcher.png` (72x72px)
- `mipmap-xhdpi/ic_launcher.png` (96x96px)
- `mipmap-xxhdpi/ic_launcher.png` (144x144px)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192px)

### Splash Screen
- `drawable/splash.png` (recomendado: 1080x1920px)

## Como Gerar Ícones

### Opção 1: Android Studio
1. Clique com botão direito em `app/src/main/res`
2. New > Image Asset
3. Escolha "Launcher Icons (Adaptive and Legacy)"
4. Selecione sua imagem
5. Configure as opções e clique "Next" > "Finish"

### Opção 2: Online
- Use ferramentas como https://romannurik.github.io/AndroidAssetStudio/
- Faça upload da sua imagem
- Baixe o pacote gerado
- Extraia na pasta `android/app/src/main/res/`

## Cores do App

Edite `android/app/src/main/res/values/colors.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">#3F51B5</color>
    <color name="colorPrimaryDark">#303F9F</color>
    <color name="colorAccent">#FF4081</color>
    <color name="statusBarColor">#000000</color>
</resources>
```

## Configurações Recomendadas

### build.gradle (app level)
```gradle
android {
    compileSdkVersion 34
    defaultConfig {
        minSdkVersion 22
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
}
```