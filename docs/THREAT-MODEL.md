# Threat model

_English | [Português](pt-BR/MODELO-DE-AMEACAS.md)_

> **Who it is for:** whoever reviews a change that touches what the app sends, stores or imports, or reports a vulnerability.
> **What is here:** what is protected, from whom, the mechanism behind each protection, and what this app does not protect.
> **Where to go for the rest:** how to report, in [SECURITY.md](../SECURITY.md); the design behind it, in [ARCHITECTURE.md](ARCHITECTURE.md).

## Contents

1. [What is protected](#1-what-is-protected)
2. [From whom](#2-from-whom)
3. [The protections and their mechanism](#3-the-protections-and-their-mechanism)
4. [What it does not protect](#4-what-it-does-not-protect)

## 1. What is protected

The text of a code. It can be a link, a phone number, or the password of a Wi-Fi network (`WIFI:T:WPA;S:...;P:...;;` is a built-in template, [`i18n/pt-BR.json`](../i18n/pt-BR.json)). Second, the person's history in the account, and third, RoqueOS itself, since the app runs on the same origin ([SECURITY.md](../SECURITY.md)).

## 2. From whom

| Actor                                | What they could get                                                                    |
| ------------------------------------ | -------------------------------------------------------------------------------------- |
| a third-party image service          | every text, in the URL; this is what the old app did until 28/09/2026                  |
| a malicious or careless pull request | code that sends the text out, reads the database directly or imports RoqueOS internals |
| a compromised dependency             | code running on install or in the page                                                 |
| a fork's pull request in CI          | a token with write access, or secrets                                                  |

## 3. The protections and their mechanism

| Protection                                           | Mechanism                                                                                                                                                                                                     |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| the image is drawn on the device                     | `qrcode` in the browser ([`src/qr.js`](../src/qr.js)); the test `nenhum arquivo de src/ tem endereço remoto no código` fails any `http(s)://` in the code of `src/` ([`test/qr.spec.js`](../test/qr.spec.js)) |
| the history keeps text and choices, no image URL     | `camposDoHistorico` writes five fields; the test `gera no aparelho e guarda no histórico só o texto, as cores, o tamanho e o tipo` pins it                                                                    |
| the old third-party URL in the history is never used | `lerEntrada` does not read `url`; the test `o histórico de antes aparece, da mais nova para a mais velha, sem usar a URL do terceiro`                                                                         |
| no database access of its own                        | `app check`, section `o app não fala com banco`, fails an import of Firebase                                                                                                                                  |
| no RoqueOS internals                                 | `app check`, section `o app não importa o RoqueOS`                                                                                                                                                            |
| no install scripts                                   | `app check`, section `scripts de instalação`; installs use `--ignore-scripts`                                                                                                                                 |
| exact pins                                           | `qrcode` at `1.5.4`, the SDK and kit by tag, the lockfile frozen in CI; RoqueOS pins this app by tag                                                                                                          |
| review on every merge                                | [`.github/CODEOWNERS`](../.github/CODEOWNERS) and the DCO check ([`.github/workflows/dco.yml`](../.github/workflows/dco.yml))                                                                                 |
| fork pull requests cannot write or read secrets      | `pull_request`, never `pull_request_target`; `permissions: contents: read` ([`.github/workflows/ci.yml`](../.github/workflows/ci.yml))                                                                        |

## 4. What it does not protect

- The same origin is not a security boundary. The SDK says so: for a first-party app, capabilities organize the code, and security comes from review on merge and the exact version pin in RoqueOS (`app-sdk` `src/contrato.js`). Code merged here can read what the RoqueOS page reads.
- The text is stored in clear in the person's account. Whoever has access to the account, or to RoqueOS's backend, sees the Wi-Fi password saved there. Generating without an account keeps it out of the history.
- The downloaded or shared PNG carries the text, readable by anyone who scans it; once it leaves the app, it is the person's.
- The remote-address test reads only `src/*.js` and `src/*.vue` at the top level of `src/`, without comments. An address assembled at runtime, or in another file type, would pass it; review is what catches that.
- The clipboard is the browser's: other code on the device may read what was copied.
- Nothing here was pen-tested; no audit beyond the parity audit of 28/09/2026 is recorded.
