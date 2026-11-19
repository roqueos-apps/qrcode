# Reference

_English | [Português](pt-BR/REFERENCIA.md)_

> **Who it is for:** whoever needs one exact fact: a command, a file, a field, a constant, a text key.
> **What is here:** tables of commands, files and folders, configuration, the manifest fields, the history entry, the constants, the metric events, the notices and the text keys.
> **Where to go for the rest:** why things are this way, in [ARCHITECTURE.md](ARCHITECTURE.md); what fails and how it shows, in [WHEN-IT-BREAKS.md](WHEN-IT-BREAKS.md).

## Contents

1. [Commands](#1-commands)
2. [Files and folders](#2-files-and-folders)
3. [Configuration](#3-configuration)
4. [`app.json`](#4-appjson)
5. [The history entry](#5-the-history-entry)
6. [Constants and exports](#6-constants-and-exports)
7. [Metric events and notices](#7-metric-events-and-notices)
8. [Text keys](#8-text-keys)
9. [`paridade.json`](#9-paridadejson)

## 1. Commands

All from [`package.json`](../package.json), run with Yarn 1.22.

| Command                                           | What it does                                                                                 | Exit codes                                |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `yarn install --frozen-lockfile --ignore-scripts` | installs exactly `yarn.lock`, without install scripts                                        | 1 if `package.json` and lock disagree     |
| `yarn dev`                                        | Vite with [`index.html`](../index.html) and [`dev/main.js`](../dev/main.js): the fake window | runs until Ctrl+C                         |
| `yarn verificar`                                  | `yarn lint && yarn format:check && yarn test && yarn app:check`                              | 0 green; non-zero at the first that fails |
| `yarn lint`                                       | `eslint .` with [`eslint.config.js`](../eslint.config.js)                                    | 1 on any error                            |
| `yarn format`                                     | `prettier --write .`                                                                         | 0                                         |
| `yarn format:check`                               | `prettier --check .`                                                                         | 1 if any file is not formatted            |
| `yarn test`                                       | `vitest run`: `test/**/*.spec.js` in jsdom                                                   | 1 if any test fails                       |
| `yarn app:check`                                  | `app check` of the SDK, against this repo                                                    | 1 if any section fails                    |

## 2. Files and folders

| Path                                                           | Who writes                             | Who reads                                               |
| -------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------- |
| [`app.json`](../app.json)                                      | a person, in a pull request            | RoqueOS, `app check`, `dev/main.js`, the tests          |
| [`src/`](../src/)                                              | a person                               | RoqueOS's Vite (shipped in the package), Vitest         |
| [`i18n/<language>.json`](../i18n/)                             | a person, the ten together             | `src/textos.js`, `app check`                            |
| [`paridade.json`](../paridade.json)                            | a person, with the change it describes | RoqueOS, in the installed package                       |
| [`ASSETS.md`](../ASSETS.md)                                    | a person                               | `app check` (rows for `public/`; there is no `public/`) |
| [`dev/main.js`](../dev/main.js), [`index.html`](../index.html) | a person                               | `yarn dev` only                                         |
| [`test/`](../test/)                                            | a person                               | Vitest; `test/preparar.js` is the setup file            |
| [`vite.config.js`](../vite.config.js)                          | a person                               | `yarn dev`, `yarn test`; not shipped                    |
| [`docs/`](.)                                                   | a person                               | readers; not shipped (`files` in `package.json`)        |
| `node_modules/`, `dist/`                                       | Yarn, Vite                             | ignored by git ([`.gitignore`](../.gitignore))          |

The package RoqueOS installs carries only `src`, `i18n`, `app.json`, `paridade.json`, `ASSETS.md`, `LICENSE` and `README.md` (`files` in [`package.json`](../package.json)).

## 3. Configuration

| Setting                               | Where                                   | Value / default                                       | Effect                                                               |
| ------------------------------------- | --------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------- |
| Node                                  | `engines`, [`.nvmrc`](../.nvmrc)        | `>=22`; `.nvmrc` 24                                   | Yarn refuses an older Node                                           |
| package manager                       | `packageManager`                        | `yarn@1.22.22`                                        | the kit's guard rejects npm and npx in this repo                     |
| `@roqueos-apps/app-sdk`               | `dependencies`                          | `github:roqueos-apps/app-sdk#v0.2.0`                  | the contract and `app check`                                         |
| `@roqueos-apps/ui`                    | `dependencies`                          | `github:roqueos-apps/ui#v0.6.0`                       | buttons, sheet, confirmation, empty state                            |
| `qrcode`                              | `dependencies`                          | `1.5.4`, exact                                        | the drawing; pinned to RoqueOS's version ([CLAUDE.md](../CLAUDE.md)) |
| `vue`                                 | `peerDependencies`                      | `^3.5.0`                                              | RoqueOS provides it                                                  |
| Prettier                              | [`.prettierrc`](../.prettierrc)         | no semicolons, single quotes, width 100, LF           | `format:check`                                                       |
| Prettier ignore                       | [`.prettierignore`](../.prettierignore) | `node_modules`, `yarn.lock`, `dist`, `public`         |                                                                      |
| Vitest                                | [`vite.config.js`](../vite.config.js)   | jsdom, `test/preparar.js`, `@roqueos-apps/ui` inlined | the kit arrives as `.vue` source                                     |
| `?idioma=`, `?leve=1`, `?convidado=1` | URL of `yarn dev`                       | browser language, normal, with account                | language, low-end profile, guest                                     |

## 4. `app.json`

| Field              | Value                                | Note                                        |
| ------------------ | ------------------------------------ | ------------------------------------------- |
| `id`               | `qrcode`                             | permanent                                   |
| `versaoDoContrato` | `1`                                  | the SDK's `VERSAO_DO_CONTRATO`              |
| `camada`           | `primeira-parte`                     | first-party app                             |
| `nome`             | the name in the ten languages        |                                             |
| `descricao`        | the description in the ten languages | says "make", never "scan"                   |
| `icone`            | `qr_code_2`                          | Material Icons name, drawn by RoqueOS       |
| `cor`              | `#8b5cf6`                            | also `ACENTO` in `src/useQRCode.js`         |
| `categoria`        | `utilities`                          |                                             |
| `janela`           | 1080 x 720, minimum 360 x 480        |                                             |
| `capacidades`      | `["colecoes"]`                       | repeated in `CAPACIDADES` of `src/index.js` |
| `colecoes`         | `["historico"]`                      | permanent name                              |
| `autor`, `licenca` | `Roque Ribeiro`, `MIT`               |                                             |

## 5. The history entry

| Field              | Type                 | Written by                      | Read as (`lerEntrada`)                    |
| ------------------ | -------------------- | ------------------------------- | ----------------------------------------- |
| `text`             | string               | the app                         | `texto`; empty entries are dropped        |
| `size`             | 200, 300, 500 or 800 | the app                         | `tamanho`; anything else becomes 300      |
| `fgColor`          | `#rrggbb`            | the app                         | `frente`; anything else becomes `#000000` |
| `bgColor`          | `#rrggbb`            | the app                         | `fundo`; anything else becomes `#ffffff`  |
| `preset`           | a `TIPOS` id or null | the app                         | `tipo`                                    |
| `criadoEm`         | ms                   | the system                      | `quando`                                  |
| `createdAtMs`      | ms                   | the old app (before 28/09/2026) | `quando` when `criadoEm` is missing       |
| `url`, `createdBy` | -                    | the old app                     | never read                                |

## 6. Constants and exports

| Name                            | File                                      | Value                                              |
| ------------------------------- | ----------------------------------------- | -------------------------------------------------- |
| default export                  | [`src/index.js`](../src/index.js)         | the app from `definirApp`                          |
| `CAPACIDADES`                   | `src/index.js`                            | `['colecoes']`                                     |
| `COLECAO`, `ACENTO`             | [`src/useQRCode.js`](../src/useQRCode.js) | `'historico'`, `'#8b5cf6'`                         |
| `TIPOS`                         | [`src/qr.js`](../src/qr.js)               | `url`, `email`, `phone`, `wifi`, `sms`, `text`     |
| `TAMANHOS`                      | `src/qr.js`                               | 200, 300, 500, 800                                 |
| `TAMANHO_PADRAO`                | `src/qr.js`                               | 300                                                |
| `FRENTE_PADRAO`, `FUNDO_PADRAO` | `src/qr.js`                               | `#000000`, `#ffffff`                               |
| `LIMITE_DO_HISTORICO`           | `src/qr.js`                               | 50                                                 |
| `CORRECOES`                     | `src/qr.js`                               | `['M', 'L']`                                       |
| `IDIOMA_CANONICO`               | [`src/textos.js`](../src/textos.js)       | `pt-BR`, also the fallback for an unknown language |
| `IDIOMAS_COM_TEXTO`             | `src/textos.js`                           | the ten languages of `i18n/`                       |
| package exports                 | [`package.json`](../package.json)         | `.` to `src/index.js`, `./app.json`                |

## 7. Metric events and notices

| What                                                    | When                                                             | Source                        |
| ------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------- |
| event `qr_generate`                                     | after a code is drawn by **Gerar**                               | `gerar` in `src/useQRCode.js` |
| event `qr_download`                                     | after the download link is clicked                               | `baixar`                      |
| notice `entreParaGuardar` (aviso)                       | generated without an account, or the collection says `sem-conta` | `gerar`                       |
| notice `erroAoGuardar` (erro)                           | the collection refused the write                                 | `gerar`                       |
| notice `longoDemais` (erro)                             | the text does not fit even with correction L                     | `desenhar`                    |
| notice `falhouGerar` (erro)                             | any other drawing failure                                        | `desenhar`                    |
| notices `imagemCopiada`, `textoCopiado`, `erroAoCopiar` | copy outcome                                                     | `copiar`                      |
| notices `baixado`, `erroAoBaixar`                       | download outcome                                                 | `baixar`                      |
| notice `erroAoLimpar` (erro)                            | a delete failed while clearing                                   | `limparHistorico`             |

A metric that throws never stops the action (`metrica` in `src/useQRCode.js`).

## 8. Text keys

The 48 keys of [`i18n/pt-BR.json`](../i18n/pt-BR.json), the canonical language; the other nine files have the same keys, and `app check` fails a missing or extra one. They fall into: actions (`baixar`, `copiar`, `compartilhar`, `gerar`, `limpar`, `cancelar`, `fechar`), form (`conteudo`, `placeholder`, `tipo`, `personalizar`, `corDoCodigo`, `fundo`, `tamanho`), types (`tipoUrl`, `tipoEmail`, `tipoTelefone`, `tipoWifi`, `tipoSms`, `tipoTexto`), templates (`modeloUrl`, `modeloEmail`, `modeloTelefone`, `modeloWifi`, `modeloSms`), sizes (`tamanhoPequeno`, `tamanhoMedio`, `tamanhoGrande`, `tamanhoHd`), history (`historico`, `historicoVazio`, `carregando`, `limparTitulo`, `limparTexto`), screen (`nomeDoApp`, `previa`, `imagemDoCodigo`, `digiteParaGerar`) and the notices in section 7.

## 9. `paridade.json`

| Field                                            | What it holds                                                             |
| ------------------------------------------------ | ------------------------------------------------------------------------- |
| `versao`, `app`                                  | `1`, `qrcode`                                                             |
| `antes`, `auditoria`                             | where the old app lived; how and when the inventory was made (28/09/2026) |
| `funcionalidades[].o_que`                        | what the person did or saw                                                |
| `funcionalidades[].estado`                       | `mantida`, `mudou` or `perdida`                                           |
| `funcionalidades[].testes`                       | `test/<file> › <exact test title>`                                        |
| `funcionalidades[].evidencia`, `nota`, `decisao` | other proof; what changed; who decided a loss                             |
