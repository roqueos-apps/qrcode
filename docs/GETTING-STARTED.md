# Getting started

_English | [Português](pt-BR/COMECAR.md)_

> **Who it is for:** whoever is opening this repo for the first time and wants to see a QR code drawn by it.
> **What is here:** the prerequisites and how to check them, each step with its command and what success looks like, the first visible result, and the first-time errors.
> **Where to go for the rest:** every command and file, in [REFERENCE.md](REFERENCE.md); how the pieces fit, in [ARCHITECTURE.md](ARCHITECTURE.md); failures, in [WHEN-IT-BREAKS.md](WHEN-IT-BREAKS.md).

## Contents

1. [Prerequisites](#1-prerequisites)
2. [Clone and install](#2-clone-and-install)
3. [Run the gate](#3-run-the-gate)
4. [Open the app](#4-open-the-app)
5. [The first code](#5-the-first-code)
6. [First-time errors](#6-first-time-errors)

## 1. Prerequisites

| Tool | Version                                                                                     | Check with      |
| ---- | ------------------------------------------------------------------------------------------- | --------------- |
| Node | 22 or newer (`engines` in [`package.json`](../package.json)); [`.nvmrc`](../.nvmrc) says 24 | `node -v`       |
| Yarn | 1.22 (`packageManager` is `yarn@1.22.22`)                                                   | `yarn -v`       |
| git  | any recent one; the dependencies come from GitHub by HTTPS                                  | `git --version` |

No account, no Firebase and no RoqueOS checkout are needed: the SDK's development system replaces all of them with the browser ([ARCHITECTURE.md](ARCHITECTURE.md#3-processes-and-where-they-run)).

## 2. Clone and install

```bash
git clone https://github.com/roqueos-apps/qrcode.git
cd qrcode
yarn install --frozen-lockfile --ignore-scripts
```

`--frozen-lockfile` installs exactly what [`yarn.lock`](../yarn.lock) pins, and `--ignore-scripts` runs no install script of any dependency, the same flags CI uses ([`.github/workflows/ci.yml`](../.github/workflows/ci.yml)). Success ends with:

```text
warning Ignored scripts due to flag.
Done in 2.35s.
```

The time is the one measured on 18/11/2026 with a warm cache; yours will differ.

## 3. Run the gate

```bash
yarn verificar
```

It runs lint, the Prettier check, the Vitest tests and the SDK's `app check`, in that order, stopping at the first that fails ([`package.json`](../package.json)). Measured on 18/11/2026 with Node 22.23.5, it ends with:

```text
 Test Files  3 passed (3)
      Tests  30 passed (30)
...
ok        capacidades opcionais declaradas

ok, o repo cumpre o contrato.
```

## 4. Open the app

```bash
yarn dev
```

Vite starts and prints the address, `http://localhost:5173/` unless the port is taken (then it tries the next one and says so). Open it: [`dev/main.js`](../dev/main.js) mounts QR Code in a fake RoqueOS window, with the size from [`app.json`](../app.json), a language selector, and a local account (`Você`) so the history works without Firebase.

| Address                               | What you see                                       |
| ------------------------------------- | -------------------------------------------------- |
| `http://localhost:5173/`              | the app in the browser language, with an account   |
| `http://localhost:5173/?idioma=ar-AR` | Arabic, right to left                              |
| `http://localhost:5173/?leve=1`       | the low-end profile (the loading bar stands still) |
| `http://localhost:5173/?convidado=1`  | without an account: no history                     |

## 5. The first code

1. Click **Link** under **Tipo**: the field gets `https://`.
2. Complete the address and click **Gerar QR Code**: the code appears in the preview, with **Baixar**, **Copiar** and **Compartilhar** below it.
3. Click **Histórico**: the entry is there, with its thumbnail. Reload the page (F5) and it is still there, because the development history lives in `localStorage`.

That is the first visible result. The labels above are the pt-BR ones ([`i18n/pt-BR.json`](../i18n/pt-BR.json)); in another language they are that language's. The development server was started and answered on 18/11/2026; the clicks above were not repeated in a browser in that session, and they follow what [`test/app.spec.js`](../test/app.spec.js) proves through the fake system.

## 6. First-time errors

| What appears                                          | What to do                                                                                                  |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `The engine "node" is incompatible with this module.` | `nvm use` (Node 24 from `.nvmrc`), see [WHEN-IT-BREAKS.md](WHEN-IT-BREAKS.md#2-installing)                  |
| `Your lockfile needs to be updated`                   | someone changed `package.json` without `yarn.lock`; see [WHEN-IT-BREAKS.md](WHEN-IT-BREAKS.md#2-installing) |
| `Port 5173 is in use, trying another one...`          | not an error: open the address Vite prints next                                                             |
| `[warn] ... Code style issues found`                  | `yarn format`, then commit; see [WHEN-IT-BREAKS.md](WHEN-IT-BREAKS.md#3-the-gate)                           |
