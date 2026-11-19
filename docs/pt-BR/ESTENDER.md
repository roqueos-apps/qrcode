# Estender

_[English](../EXTENDING.md) | Português_

> **Para quem:** quem acrescenta um tipo de conteúdo, um tamanho, um texto, um campo do histórico ou uma capacidade ao app.
> **O que tem aqui:** cada ponto de extensão, os arquivos que ele toca e a conferência que reprova quando falta um passo.
> **Onde ir para o resto:** os valores de hoje, em [REFERENCIA.md](REFERENCIA.md); as regras para contribuir, em [CONTRIBUTING.md](CONTRIBUTING.md).

## Sumário

1. [Um tipo de conteúdo](#1-um-tipo-de-conteúdo)
2. [Um tamanho](#2-um-tamanho)
3. [Um texto](#3-um-texto)
4. [Um campo do histórico](#4-um-campo-do-histórico)
5. [Uma capacidade do sistema](#5-uma-capacidade-do-sistema)

Abra uma issue antes quando a mudança altera o que a pessoa vê ou o que o histórico guarda ([CONTRIBUTING.md](CONTRIBUTING.md)).

## 1. Um tipo de conteúdo

Um tipo é uma entrada em `TIPOS` ([`src/qr.js`](../../src/qr.js)): um `id`, o nome de um ícone do Material, a chave do rótulo e a chave do modelo (ou `null`, como o `text`).

```js
Object.freeze({ id: 'geo', icone: 'place', rotulo: 'tipoGeo', modelo: 'modeloGeo' }),
```

O exemplo acima é ilustrativo; não existe tipo `geo`. Depois ponha `tipoGeo` e `modeloGeo` nos dez [`i18n/*.json`](../../i18n/), com o modelo na convenção de cada idioma. A tela pega sozinha ([`src/QRCode.vue`](../../src/QRCode.vue)). O que reprova quando falta um passo: o `app check` reprova chave ausente em qualquer idioma; o teste `cada tipo tem rótulo e ícone, e só o texto livre não tem modelo` no [`test/qr.spec.js`](../../test/qr.spec.js) confere rótulo, ícone e que só o `text` não tem modelo. Nunca tire nem renomeie um `id` que existe: ele é o `preset` gravado no histórico das pessoas, e o `lerEntrada` transforma um desconhecido em `null`.

## 2. Um tamanho

Um tamanho é uma entrada em `TAMANHOS` (`valor` em pixels e a chave do rótulo). O `tamanho()` só aceita valores da lista e transforma qualquer outro em 300, tanto ao desenhar quanto ao ler uma entrada antiga, então tirar um tamanho muda como as entradas antigas abrem. Ponha o rótulo nos dez idiomas. O teste `a imagem é um PNG desenhado aqui, nas cores e no tamanho pedidos` cobre o tamanho do desenho.

## 3. Um texto

Todo texto visível é uma chave no [`i18n/pt-BR.json`](../../i18n/pt-BR.json), o idioma canônico, e nos outros nove arquivos com a mesma chave. No código é `t('chave')` ([`src/textos.js`](../../src/textos.js), `traduzir`). Chave que falta nos textos carregados mostra a própria chave, e o teste pega; chave que falta num idioma reprova no `app check` (`i18n/<idioma>.json sem: <chave>`).

## 4. Um campo do histórico

Só aditivo. Ponha no `camposDoHistorico` e leia no `lerEntrada` com um padrão, porque toda entrada gravada antes não tem o campo. Os nomes que existem (`text`, `size`, `fgColor`, `bgColor`, `preset`) são permanentes, e o histórico nunca guarda imagem nem URL ([CLAUDE.md](../../CLAUDE.md)). O SDK recusa campo que é o sistema quem carimba (`campo-do-sistema`, como o `criadoEm`). Atualize o teste `guarda só texto, tamanho, cores e tipo, com os nomes de antes` no [`test/qr.spec.js`](../../test/qr.spec.js), que trava exatamente o que é gravado.

## 5. Uma capacidade do sistema

Usar outra capacidade opcional do `app-sdk` (`ia`, `arquivos`, `abertura`) é declarar em `capacidades` no [`app.json`](../../app.json) e no `CAPACIDADES` do [`src/index.js`](../../src/index.js), no mesmo commit: o `index.js` não pode importar o JSON, e o teste `o id e as capacidades são os do manifesto, e o manifesto é válido` reprova quando as duas listas diferem. O `app check` reprova `sistema.<capacidade>` usado sem a declaração. A versão do SDK pinada (`v0.2.0`) precisa oferecer a capacidade.
