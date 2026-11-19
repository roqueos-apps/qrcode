# Extending

_English | [Português](pt-BR/ESTENDER.md)_

> **Who it is for:** whoever adds a content type, a size, a text, a history field or a capability to the app.
> **What is here:** each extension point, the files it touches, and the check that fails when a step is missing.
> **Where to go for the rest:** the current values, in [REFERENCE.md](REFERENCE.md); the rules for contributing, in [CONTRIBUTING.md](../CONTRIBUTING.md).

## Contents

1. [A content type](#1-a-content-type)
2. [A size](#2-a-size)
3. [A text](#3-a-text)
4. [A history field](#4-a-history-field)
5. [A capability of the system](#5-a-capability-of-the-system)

Open an issue first when the change alters what people see or what the history stores ([CONTRIBUTING.md](../CONTRIBUTING.md)).

## 1. A content type

A type is one entry in `TIPOS` ([`src/qr.js`](../src/qr.js)): an `id`, a Material icon name, a label key and a template key (or `null`, like `text`).

```js
Object.freeze({ id: 'geo', icone: 'place', rotulo: 'tipoGeo', modelo: 'modeloGeo' }),
```

The example above is illustrative; no `geo` type exists. Then add `tipoGeo` and `modeloGeo` to the ten [`i18n/*.json`](../i18n/), with the template in each language's convention. The screen picks it up by itself ([`src/QRCode.vue`](../src/QRCode.vue)). What fails when a step is missing: `app check` fails a key absent from any language; the test `cada tipo tem rótulo e ícone, e só o texto livre não tem modelo` in [`test/qr.spec.js`](../test/qr.spec.js) checks label, icon and that only `text` has no template. Never remove or rename an existing `id`: it is the `preset` stored in people's history, and `lerEntrada` turns an unknown one into `null`.

## 2. A size

A size is one entry in `TAMANHOS` (`valor` in pixels and a label key). `tamanho()` accepts only listed values and turns anything else into 300, both when drawing and when reading an old entry, so removing a size changes how old entries open. Add the label to the ten languages. The test `a imagem é um PNG desenhado aqui, nas cores e no tamanho pedidos` covers the drawing size.

## 3. A text

Every visible text is a key in [`i18n/pt-BR.json`](../i18n/pt-BR.json), the canonical language, and in the other nine files with the same key. In the code it is `t('chave')` ([`src/textos.js`](../src/textos.js), `traduzir`). A key missing from the loaded texts shows the key itself, which the tests catch; a key missing from a language fails `app check` (`i18n/<language>.json sem: <key>`).

## 4. A history field

Additive only. Add it to `camposDoHistorico` and read it in `lerEntrada` with a default, because every entry written before it lacks the field. The existing names (`text`, `size`, `fgColor`, `bgColor`, `preset`) are permanent, and the history never stores an image or a URL ([CLAUDE.md](../CLAUDE.md)). The SDK refuses a field the system stamps (`campo-do-sistema`, such as `criadoEm`). Update the test `guarda só texto, tamanho, cores e tipo, com os nomes de antes` in [`test/qr.spec.js`](../test/qr.spec.js), which pins exactly what is stored.

## 5. A capability of the system

Using another optional capability of the `app-sdk` (`ia`, `arquivos`, `abertura`) means declaring it in `capacidades` of [`app.json`](../app.json) and in `CAPACIDADES` of [`src/index.js`](../src/index.js), in the same commit: `index.js` cannot import the JSON, and the test `o id e as capacidades são os do manifesto, e o manifesto é válido` fails when the two lists differ. `app check` fails a `sistema.<capability>` used without the declaration. The SDK version pinned (`v0.2.0`) must offer the capability.
