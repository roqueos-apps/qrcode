# Glossary

_English | [Português](pt-BR/GLOSSARIO.md)_

> **Who it is for:** whoever reads the code (which is in Portuguese) and meets a word that means something specific here.
> **What is here:** each term as it appears in the code, what it is, and where it lives.
> **Where to go for the rest:** the values of each constant, in [REFERENCE.md](REFERENCE.md); how the pieces fit, in [ARCHITECTURE.md](ARCHITECTURE.md).

| Term                            | What it is                                                                                                | Where it lives                                                                     |
| ------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `sistema`                       | the object RoqueOS (or the development or fake system) hands the app; the only way to talk to RoqueOS     | `app-sdk`; received in [`src/index.js`](../src/index.js)                           |
| capacidade                      | one part of the `sistema` (`idioma`, `avisar`, `metricas`, `colecoes`...); optional ones must be declared | `capacidades` in [`app.json`](../app.json)                                         |
| `colecoes`                      | the capability that keeps documents in the person's account, in real time                                 | `sistema.colecoes.abrir('historico')` in [`src/useQRCode.js`](../src/useQRCode.js) |
| `historico`                     | the collection of this app; RoqueOS maps it to `users/{uid}/qrCodes`                                      | `COLECAO` in `src/useQRCode.js`                                                    |
| entrada                         | one item of the history: text, size, colors and type                                                      | `camposDoHistorico`, `lerEntrada` in [`src/qr.js`](../src/qr.js)                   |
| `tipo` / `preset`               | the content kind (`url`, `email`, `phone`, `wifi`, `sms`, `text`); `preset` is the stored field name      | `TIPOS` in `src/qr.js`                                                             |
| modelo                          | the template a type puts in the field, in the person's language (`modeloWifi`...)                         | [`i18n/`](../i18n/)                                                                |
| `frente` / `fundo`              | the code color and the background color (`fgColor` / `bgColor` when stored)                               | `src/qr.js`                                                                        |
| correção                        | the QR error correction level; M first, L when M does not fit                                             | `CORRECOES` in `src/qr.js`                                                         |
| `longo-demais`                  | the `codigo` of the error when the text does not fit even with L                                          | `gerarImagem` in `src/qr.js`                                                       |
| `sem-conta`                     | the SDK error code when a write needs an account and nobody is signed in                                  | handled in `gerar`, `src/useQRCode.js`                                             |
| modo leve / perfil leve         | the low-end device profile; the loading bar stands still                                                  | `sistema.desempenho.modoLeve()`, `?leve=1`                                         |
| janela falsa                    | the development window of the SDK that `yarn dev` opens                                                   | [`dev/main.js`](../dev/main.js)                                                    |
| sistema falso                   | the in-memory system of the SDK used by the tests                                                         | [`test/app.spec.js`](../test/app.spec.js)                                          |
| `app check`                     | the SDK command that checks a repo against the contract                                                   | `yarn app:check`                                                                   |
| `verificar`                     | the gate: lint, format, tests and `app check`                                                             | [`package.json`](../package.json)                                                  |
| paridade                        | the inventory of what the old in-core app did and what happened to each item                              | [`paridade.json`](../paridade.json)                                                |
| `mantida` / `mudou` / `perdida` | the three states of a parity item                                                                         | `paridade.json`                                                                    |
| núcleo                          | the closed RoqueOS repo where the app lived until 28/09/2026                                              | [README.md](../README.md)                                                          |
| primeira parte                  | an app made by the house, mounted on the same origin as RoqueOS                                           | `camada` in `app.json`                                                             |
| acento                          | the app color `#8b5cf6`, passed to the kit components and as `--qr-acento`                                | `ACENTO` in `src/useQRCode.js`                                                     |
| folha                           | the bottom sheet of the kit (`RosFolha`) where the history opens                                          | [`src/QRCode.vue`](../src/QRCode.vue)                                              |
| DCO                             | Developer Certificate of Origin: the `Signed-off-by` line every commit needs                              | [`.github/workflows/dco.yml`](../.github/workflows/dco.yml)                        |
