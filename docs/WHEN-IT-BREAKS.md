# When it breaks

_English | [Português](pt-BR/QUANDO-QUEBRA.md)_

> **Who it is for:** whoever saw the install, the gate, `app check`, the app or a release fail and wants the cause and the fix.
> **What is here:** the first diagnostic command, then one table per area with what appears, the cause and what to do.
> **Where to go for the rest:** the formats each check reads, in [REFERENCE.md](REFERENCE.md); why each rule exists, in [ARCHITECTURE.md](ARCHITECTURE.md#8-design-decisions).

## Contents

1. [First, the diagnostic](#1-first-the-diagnostic)
2. [Installing](#2-installing)
3. [The gate](#3-the-gate)
4. [`app check`](#4-app-check)
5. [The app on screen](#5-the-app-on-screen)
6. [Releasing and RoqueOS](#6-releasing-and-roqueos)

The programs print in Portuguese (Yarn, Vite and Prettier in English); the messages below are quoted exactly as they appear. Unless a row says otherwise, each message was reproduced on 18/11/2026 in a throwaway copy of the repo, by planting the cause.

## 1. First, the diagnostic

```bash
yarn verificar        # where the gate stops: lint, format, tests, app check, in that order
yarn app:check        # every app check section at once, never only the first
```

`yarn verificar` stops at the first step that fails; `app check` prints every problem of every section and exits 1 if there is any. In the app, the console prefixes every error with `[qrcode]` ([`src/useQRCode.js`](../src/useQRCode.js)).

## 2. Installing

| What appears                                                                                                     | Cause                                                               | What to do                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| ``error Your lockfile needs to be updated, but yarn was run with `--frozen-lockfile`.``                          | `package.json` and `yarn.lock` disagree                             | install without the flag only if the dependency change is intended, and commit both files together                                  |
| `error @roqueos-apps/qrcode@0.1.1: The engine "node" is incompatible with this module. Expected version ">=22".` | Node older than 22 (`engines` in [`package.json`](../package.json)) | `nvm use` (the [`.nvmrc`](../.nvmrc) says 24); reproduced with a fake `engines`                                                     |
| `Permission denied (publickey)` while fetching `@roqueos-apps/ui`                                                | the kit came through `git+ssh` and the machine had no key           | already fixed: the kit comes by HTTPS (`github:roqueos-apps/ui#v0.6.0`); seen in CI on 29/09/2026 ([CHANGELOG.md](../CHANGELOG.md)) |

## 3. The gate

| What appears                                                                                                                           | Cause                                                                           | What to do                                                                                                                        |
| -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `[warn] Code style issues found in the above file. Run Prettier with --write to fix.`                                                  | a file (Markdown included) is not in the Prettier format                        | `yarn format`, review the diff, commit                                                                                            |
| `× o texto não sai do aparelho > nenhum arquivo de src/ tem endereço remoto no código`, with `expected [ 'qr.js' ] to deeply equal []` | an `http://` or `https://` address in the code of `src/` (comments are allowed) | remove it: the code is drawn on the device and nothing goes to a third party ([`test/qr.spec.js`](../test/qr.spec.js))            |
| `o id e as capacidades são os do manifesto, e o manifesto é válido` failing                                                            | `CAPACIDADES` in `src/index.js` and `capacidades` in `app.json` diverged        | change both lists in the same commit (not reproduced; read from [`test/app.spec.js`](../test/app.spec.js))                        |
| `'vue/no-undef-components'` from ESLint                                                                                                | a component used without import                                                 | import it from `@roqueos-apps/ui`: outside RoqueOS there is no Quasar ([`eslint.config.js`](../eslint.config.js)); not reproduced |

## 4. `app check`

| What appears                                                                                           | Cause                                              | What to do                                                                         |
| ------------------------------------------------------------------------------------------------------ | -------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `package.json declara "postinstall", que roda sozinho no install de quem depende deste pacote`         | an install script in `package.json`                | remove it; RoqueOS installs the package and would run it                           |
| `i18n/de-DE.json sem: baixar`                                                                          | a key of `pt-BR.json` missing in another language  | add it to the ten files                                                            |
| `src/qr.scss:318 usa --ros-foo, que não está entre as variáveis do sistema que um app pode usar (...)` | a `--ros-*` variable outside the SDK's contract    | use only the listed ones, or an app variable `--qr-*`                              |
| `src/useQRCode.js:30 usa sistema.arquivos sem "arquivos" em capacidades no app.json`                   | an optional capability used without being declared | declare it in `app.json` and in `CAPACIDADES`, or do not use it                    |
| `... importa "firebase": o app não fala com banco, quem guarda é o sistema`                            | an import of Firebase                              | use the `colecoes` capability; not reproduced, message read from the installed SDK |

The file and line numbers above are the ones of the planted mistake; yours will differ.

## 5. The app on screen

| What appears                                                                           | Cause                                                                  | What to do                                                                                                            |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `[qrcode] o sistema não cumpre o contrato: falta a capacidade "colecoes"`              | the system that mounted the app has no `colecoes`                      | mount it in a RoqueOS (or SDK system) that offers the capability; proven by [`test/app.spec.js`](../test/app.spec.js) |
| notice `O texto é longo demais para caber num QR Code.`                                | the text does not fit even with correction L (above 2,953 bytes)       | shorten the text; not a bug                                                                                           |
| notice `Entre na sua conta para guardar no histórico.`                                 | no account, or the collection answered `sem-conta`                     | sign in; the code on screen is valid anyway                                                                           |
| notice `Erro ao salvar no histórico` and `[qrcode] histórico recusado:` in the console | the collection refused the write                                       | the console carries the system's error and its `codigo`                                                               |
| Copy pastes text instead of the image                                                  | the browser has no `ClipboardItem` or refused the image                | expected fallback ([`src/useQRCode.js`](../src/useQRCode.js), `copiar`)                                               |
| Copy or Share does nothing on iPhone Safari                                            | an `await` before the call leaves the tap (fixed in 0.1.1, 28/09/2026) | keep `pngDaImagem` synchronous; a regression shows here                                                               |
| Esc no longer closes the history after Clear                                           | the button became `disabled` and focus went to `body` (QA, 28/09/2026) | keep `aria-disabled` on Clear ([`src/QRCode.vue`](../src/QRCode.vue))                                                 |
| `Port 5173 is in use, trying another one...` on `yarn dev`                             | another Vite is using the port                                         | open the address Vite prints next                                                                                     |

## 6. Releasing and RoqueOS

| What appears                                                    | Cause                                                                                                                       | What to do                                                                                               |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| RoqueOS refuses the new version because of the parity inventory | a test cited in [`paridade.json`](../paridade.json) was renamed or deleted, an item is in doubt, or a loss has no `decisao` | update `paridade.json` in the same commit as the change ([README.md](../README.md))                      |
| RoqueOS's build breaks importing the app                        | a direct `import` of a JSON file in `src/`                                                                                  | use `?raw` and `JSON.parse` like [`src/textos.js`](../src/textos.js) (measured in the games, 25/09/2026) |
| an old history disappears                                       | a history field was renamed                                                                                                 | revert the rename; the field names are permanent                                                         |
| `dco` fails with `commit ... sem Signed-off-by.`                | a commit without `Signed-off-by`                                                                                            | `git rebase --signoff main` and push again ([`.github/workflows/dco.yml`](../.github/workflows/dco.yml)) |
