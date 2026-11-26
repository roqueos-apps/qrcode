# Testing

_English | [Português](pt-BR/TESTES.md)_

> **Who it is for:** whoever changes the app and needs to know which test proves what, and what "done" means.
> **What is here:** the gate, each suite and what it proves, the acceptance criterion, and what the tests do not cover.
> **Where to go for the rest:** when a test fails, [WHEN-IT-BREAKS.md](WHEN-IT-BREAKS.md); the inventory that cites the tests, [`paridade.json`](../paridade.json).

## Contents

1. [The gate](#1-the-gate)
2. [The suites](#2-the-suites)
3. [Acceptance criterion](#3-acceptance-criterion)
4. [What the tests do not cover](#4-what-the-tests-do-not-cover)

## 1. The gate

```bash
yarn verificar
```

Lint, Prettier, Vitest and `app check`, the same in CI on every push to `main` and every pull request ([`.github/workflows/ci.yml`](../.github/workflows/ci.yml)). Measured on 18/11/2026: 3 test files, 30 tests passing, the eight `app check` sections `ok`.

## 2. The suites

| File                                                              | Tests | What it proves                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`test/qr.spec.js`](../test/qr.spec.js)                           | 13    | no remote address in `src/`; the PNG is drawn here in the requested colors and size; a text too long rejects with `longo-demais`; everything the old service generated fits (L) and short text comes out with M; the PNG for copy and share is built without waiting; the history stores only five fields with the old names; old entries read with the device date; ordering, limit and empty entries; color, size, contrast, id and summary details; every type has label and icon                                                                       |
| [`test/app.spec.js`](../test/app.spec.js)                         | 16    | the app through the SDK's fake system: id and capabilities match the manifest; refusal of a system without `colecoes`; generate and save; no account; old history without the third-party URL; loading bar (still in the low-end profile); open an entry without a new one; type templates in the person's language; color change clears the image; text too long saves nothing; clear with confirmation, one by one; download with metric; copy image, text fallback, refused image; share with file, text, copy fallback; cancelled sheet copies nothing |
| [`test/troca-de-idioma.spec.js`](../test/troca-de-idioma.spec.js) | 1     | two language changes in a row: the last requested wins even when its answer arrives first                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `app check` (SDK)                                                 | -     | install scripts, manifest, texts in ten languages, asset origin, no database, no RoqueOS imports, CSS variables, optional capabilities declared                                                                                                                                                                                                                                                                                                                                                                                                            |

The setup in [`test/preparar.js`](../test/preparar.js) gives jsdom a no-op `ResizeObserver` and `matchMedia`, and unmounts every component after each test.

## 3. Acceptance criterion

A change is done when `yarn verificar` is green and, for a visible change, the app was opened in `yarn dev` with a screenshot ([`.claude/loop.md`](../.claude/loop.md)). Every fix comes with a test that fails without it, and a new check passes a mutation (plant the mistake, see it red) ([CLAUDE.md](../CLAUDE.md)). A test cited in [`paridade.json`](../paridade.json) keeps its exact title, or the inventory changes in the same commit. A test is never weakened to make the gate pass.

## 4. What the tests do not cover

- A real browser: the suites run in jsdom; layout, the container query and the real clipboard are not exercised.
- Safari on iPhone: only the synchronous path is proven, nothing was measured on the device ([`paridade.json`](../paridade.json)).
- That a generated PNG scans back: the parity audit read codes back on 28/09/2026 (a Wi-Fi with ç, ã and emoji), but no test in this repo decodes the image.
- RoqueOS's real collection, rules and offline behavior.
- There is no end-to-end suite and no visual regression in this repo.
