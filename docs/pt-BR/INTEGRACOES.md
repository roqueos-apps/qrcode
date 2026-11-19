# Integrações

_[English](../INTEGRATIONS.md) | Português_

> **Para quem:** quem liga o app no RoqueOS, ou em outro sistema que implemente o `app-sdk`, ou precisa saber exatamente o que atravessa a fronteira.
> **O que tem aqui:** como o pacote é instalado, o contrato do mount, cada capacidade usada e como, a coleção, os eventos de métrica e a conferência de paridade que o RoqueOS roda.
> **Onde ir para o resto:** o contrato em si é do SDK ([`app-sdk`](https://github.com/roqueos-apps/app-sdk)); o lado de dentro, em [ARQUITETURA.md](ARQUITETURA.md).

## Sumário

1. [O pacote](#1-o-pacote)
2. [Montar](#2-montar)
3. [As capacidades que usa](#3-as-capacidades-que-usa)
4. [A coleção](#4-a-coleção)
5. [Métricas](#5-métricas)
6. [A conferência de paridade](#6-a-conferência-de-paridade)

## 1. O pacote

O pacote é o `@roqueos-apps/qrcode`, versão 0.1.1, `private: true`: não está no npm. Quem hospeda instala como dependência git pinada por tag. Em 18/11/2026 o clone local do front do RoqueOS tinha:

```json
"@roqueos-apps/qrcode": "git+ssh://git@github.com/roqueos-apps/qrcode.git#v0.1.1"
```

e carregava sob demanda como `ROSQrcode: () => import('@roqueos-apps/qrcode')` (o `carregadoresDeApps.gen.js` dele). As saídas são `.` (o app, do [`src/index.js`](../../src/index.js)) e `./app.json` ([`package.json`](../../package.json)). A fonte vai como está (`.vue` e `.scss`), e quem hospeda compila com o Vite e o Vue dele; o `vue` é dependência par (`^3.5.0`).

## 2. Montar

```js
import qrcode from '@roqueos-apps/qrcode'

const montagem = qrcode.mount(el, sistema, { windowId: 'w1', ativo: true })
montagem.ativar(false) // the window lost focus
montagem.desmontar() // the window closed
```

É a forma que os testes usam ([`test/app.spec.js`](../../test/app.spec.js)). O `mount` confere o sistema antes: sistema sem `colecoes` lança `[qrcode] o sistema não cumpre o contrato: falta a capacidade "colecoes"`. O app monta o próprio app Vue dentro do `el`; nada das stores, plugins ou estilos globais de quem hospeda chega lá. Desmontar duas vezes não faz mal (o SDK ignora a segunda chamada).

## 3. As capacidades que usa

| Capacidade      | Obrigatória no SDK | O que o QR Code chama                                       | Para quê                                                                   |
| --------------- | ------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------------- |
| `identidade`    | sim                | `atual().uid`                                               | decidir se o código vai para o histórico                                   |
| `idioma`        | sim                | `atual()`, `aoMudar(fn)`                                    | carregar os textos e acompanhar a troca de idioma                          |
| `desempenho`    | sim                | `modoLeve()`                                                | o perfil leve (barra do carregando parada)                                 |
| `avisar`        | sim                | `avisar(mensagem, { tipo })`                                | todo aviso da [REFERENCIA.md](REFERENCIA.md#7-eventos-de-métrica-e-avisos) |
| `metricas`      | sim                | `evento('qr_generate')`, `evento('qr_download')`            | uso; erro nela nunca derruba a ação                                        |
| `armazenamento` | sim                | não usa                                                     |                                                                            |
| `colecoes`      | não, declarada     | `abrir('historico')` e depois `observar`, `criar`, `apagar` | o histórico                                                                |

Fontes: [`src/index.js`](../../src/index.js) e [`src/useQRCode.js`](../../src/useQRCode.js); a lista de obrigatórias é a do `app-sdk` v0.2.0 instalado.

## 4. A coleção

O app abre a `historico`; quem hospeda decide onde ela mora. O RoqueOS mapeia para `users/{uid}/qrCodes`, o lugar que o app de antes, no núcleo, usava, e por isso o histórico antigo continua aparecendo ([CLAUDE.md](../../CLAUDE.md)). O app grava com `criar(id, campos)` (id `qr_<ms>_<base36>`), apaga com `apagar(id)` um por vez, e nunca chama `atualizar`. Os campos estão na [REFERENCIA.md](REFERENCIA.md#5-a-entrada-do-histórico). Quem implementa `colecoes` precisa carimbar o `criadoEm` e responder `sem-conta` quando ninguém entrou; o app trata esse código como "entre para guardar".

## 5. Métricas

Dois eventos, sem dado junto: `qr_generate` depois que o **Gerar** desenha um código, e `qr_download` depois de um download. Os nomes fazem parte do contrato com o histórico de métricas e não mudam sem motivo (o [`.github/pull_request_template.md`](../../.github/pull_request_template.md) pede isso). Abrir uma entrada do histórico desenha sem contar `qr_generate`.

## 6. A conferência de paridade

O [`paridade.json`](../../paridade.json) vai no pacote. O RoqueOS lê do pacote instalado antes de aceitar uma versão: teste citado que não existe mais neste repo, item sem estado final ou `perdida` sem `decisao` reprovam o teste dele ([README.pt-BR.md](../../README.pt-BR.md)). Em 18/11/2026 eram 55 itens: 37 `mantida`, 18 `mudou`, 0 `perdida`. Renomeie um teste citado ali e o lado do RoqueOS fica vermelho no próximo pin.
