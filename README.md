# Meu PC

Aplicação React + Vite para montar, comparar e salvar configurações de PCs. A partir da versão 1.0.15, o projeto é **GitHub-first**: a mesma base gera o site no GitHub Pages e um APK Android com Capacitor através do GitHub Actions.

## Desenvolvimento local

```bash
npm install
npm run dev
```

## Build web

```bash
npm run build
```

Os arquivos de produção são gerados em `dist/`.

## GitHub Pages

O workflow `.github/workflows/pages.yml` publica a aplicação automaticamente quando houver `push` na branch `main`.

No GitHub, faça apenas uma configuração inicial:

1. Abra **Settings → Pages**.
2. Em **Build and deployment → Source**, escolha **GitHub Actions**.
3. Faça um push na `main` ou execute manualmente o workflow **Publicar no GitHub Pages**.

O `vite.config.js` usa caminhos relativos (`base: './'`), permitindo que o mesmo build funcione em repositórios de projeto do GitHub Pages e dentro do Capacitor.

## APK Android com Capacitor

O Capacitor está configurado em `capacitor.config.json`:

- App: **Meu PC**
- ID: `com.adriedson.construirpc`
- Conteúdo web: `dist`

O workflow `.github/workflows/android-apk.yml` executa automaticamente em cada `push` na `main` e também pode ser iniciado manualmente em **Actions → Gerar APK Android → Run workflow**.

Ele executa:

```text
npm install
npm run build
npx cap add android
npx cap sync android
./gradlew assembleDebug
```

Ao terminar, abra a execução do workflow e baixe o artefato **MeuPC-APK**. Dentro dele estará um arquivo semelhante a:

```text
MeuPC-1.0.15-debug.apk
```

Esse APK é adequado para instalação direta e testes. Publicação em loja exige posteriormente assinatura/release própria.

## Comandos Capacitor locais

```bash
# cria o projeto Android uma vez
npm run cap:add:android

# recompila a web e sincroniza com as plataformas existentes
npm run cap:sync

# sincroniza especificamente o Android
npm run android:sync
```

> O diretório `android/` não precisa ficar versionado nesta configuração: o GitHub Actions o recria durante cada build.

## Dados

Os setups, peças personalizadas e preferências continuam armazenados no `localStorage`. O mesmo formato de armazenamento das versões anteriores foi mantido.

A instalação Android possui seu próprio armazenamento local. Os dados da versão web no navegador não são automaticamente compartilhados com o APK; use o recurso de backup/restauração do aplicativo quando precisar transferi-los.

## Estrutura principal

```text
.github/workflows/
├── android-apk.yml
└── pages.yml
src/
├── components/
├── data/
├── features/
├── pages/
└── theme/
capacitor.config.json
package.json
vite.config.js
```

## Versão atual

**1.0.8** — Capacitor Android, geração automática de APK pelo GitHub Actions e publicação web pelo GitHub Pages.
