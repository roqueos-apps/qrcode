# Integrations

_English | [Português](pt-BR/INTEGRACOES.md)_

> **Who it is for:** whoever wires the app into RoqueOS or another system that implements the `app-sdk`, or needs to know exactly what crosses the boundary.
> **What is here:** how the package is installed, the mount contract, each capability used and how, the collection, the metric events, and the parity check RoqueOS runs.
> **Where to go for the rest:** the contract itself is the SDK's ([`app-sdk`](https://github.com/roqueos-apps/app-sdk)); the internals, in [ARCHITECTURE.md](ARCHITECTURE.md).

## Contents

1. [The package](#1-the-package)
2. [Mounting](#2-mounting)
3. [The capabilities it uses](#3-the-capabilities-it-uses)
4. [The collection](#4-the-collection)
5. [Metrics](#5-metrics)
6. [The parity check](#6-the-parity-check)

## 1. The package

The package is `@roqueos-apps/qrcode`, version 0.1.1, `private: true`: it is not on npm. A host installs it as a git dependency pinned by tag. On 18/11/2026 the local clone of the RoqueOS front had:

```json
"@roqueos-apps/qrcode": "git+ssh://git@github.com/roqueos-apps/qrcode.git#v0.1.1"
```

and loaded it lazily as `ROSQrcode: () => import('@roqueos-apps/qrcode')` (its `carregadoresDeApps.gen.js`). The exports are `.` (the app, from [`src/index.js`](../src/index.js)) and `./app.json` ([`package.json`](../package.json)). The source ships as is (`.vue` and `.scss`), and the host compiles it with its own Vite and Vue; `vue` is a peer dependency (`^3.5.0`).

## 2. Mounting

```js
import qrcode from '@roqueos-apps/qrcode'

const montagem = qrcode.mount(el, sistema, { windowId: 'w1', ativo: true })
montagem.ativar(false) // the window lost focus
montagem.desmontar() // the window closed
```

This is the form the tests use ([`test/app.spec.js`](../test/app.spec.js)). `mount` checks the system first: a system without `colecoes` throws `[qrcode] o sistema não cumpre o contrato: falta a capacidade "colecoes"`. The app mounts its own Vue app inside `el`; nothing of the host's stores, plugins or global styles reaches it. Unmounting twice is harmless (the SDK ignores the second call).

## 3. The capabilities it uses

| Capability      | Required by the SDK | What QR Code calls                                      | For what                                                                 |
| --------------- | ------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------ |
| `identidade`    | yes                 | `atual().uid`                                           | decide whether the code goes to the history                              |
| `idioma`        | yes                 | `atual()`, `aoMudar(fn)`                                | load the texts and follow a language change                              |
| `desempenho`    | yes                 | `modoLeve()`                                            | the low-end profile (still loading bar)                                  |
| `avisar`        | yes                 | `avisar(mensagem, { tipo })`                            | every notice in [REFERENCE.md](REFERENCE.md#7-metric-events-and-notices) |
| `metricas`      | yes                 | `evento('qr_generate')`, `evento('qr_download')`        | usage; a throw never stops the action                                    |
| `armazenamento` | yes                 | not used                                                |                                                                          |
| `colecoes`      | no, declared        | `abrir('historico')` then `observar`, `criar`, `apagar` | the history                                                              |

Sources: [`src/index.js`](../src/index.js) and [`src/useQRCode.js`](../src/useQRCode.js); the required list is the one of `app-sdk` v0.2.0 as installed.

## 4. The collection

The app opens `historico`; the host decides where it lives. RoqueOS maps it to `users/{uid}/qrCodes`, the place the old in-core app used, so old histories keep appearing ([CLAUDE.md](../CLAUDE.md)). The app writes with `criar(id, campos)` (id `qr_<ms>_<base36>`), deletes with `apagar(id)` one at a time, and never calls `atualizar`. The fields are in [REFERENCE.md](REFERENCE.md#5-the-history-entry). A host that implements `colecoes` must stamp `criadoEm` itself and answer `sem-conta` when nobody is signed in; the app treats that code as "sign in to save".

## 5. Metrics

Two events, with no data attached: `qr_generate` after a code is drawn by **Gerar**, and `qr_download` after a download. The names are part of the contract with the history of metrics and do not change without a reason ([`.github/pull_request_template.md`](../.github/pull_request_template.md) asks for it). Opening an entry from the history draws without counting `qr_generate`.

## 6. The parity check

[`paridade.json`](../paridade.json) ships in the package. RoqueOS reads it from the installed package before accepting a version: a cited test that no longer exists in this repo, an item without a final state, or a `perdida` without `decisao` fail its own test ([README.md](../README.md)). On 18/11/2026 it held 55 items: 37 `mantida`, 18 `mudou`, 0 `perdida`. Rename a test cited there and the RoqueOS side goes red on the next pin.
