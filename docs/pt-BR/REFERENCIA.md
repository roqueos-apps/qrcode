# Referência

_[English](../REFERENCE.md) | Português_

> **Para quem:** quem precisa de um fato exato: um comando, um arquivo, um campo, uma constante, uma chave de texto.
> **O que tem aqui:** tabelas de comandos, arquivos e pastas, configuração, os campos do manifesto, a entrada do histórico, as constantes, os eventos de métrica, os avisos e as chaves de texto.
> **Onde ir para o resto:** o porquê de cada coisa, em [ARQUITETURA.md](ARQUITETURA.md); o que falha e como aparece, em [QUANDO-QUEBRA.md](QUANDO-QUEBRA.md).

## Sumário

1. [Comandos](#1-comandos)
2. [Arquivos e pastas](#2-arquivos-e-pastas)
3. [Configuração](#3-configuração)
4. [`app.json`](#4-appjson)
5. [A entrada do histórico](#5-a-entrada-do-histórico)
6. [Constantes e saídas](#6-constantes-e-saídas)
7. [Eventos de métrica e avisos](#7-eventos-de-métrica-e-avisos)
8. [Chaves de texto](#8-chaves-de-texto)
9. [`paridade.json`](#9-paridadejson)

## 1. Comandos

Todos do [`package.json`](../../package.json), com o Yarn 1.22.

| Comando                                           | O que faz                                                                                          | Códigos de saída                               |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `yarn install --frozen-lockfile --ignore-scripts` | instala exatamente o `yarn.lock`, sem script de instalação                                         | 1 se `package.json` e lock divergem            |
| `yarn dev`                                        | Vite com o [`index.html`](../../index.html) e o [`dev/main.js`](../../dev/main.js): a janela falsa | roda até o Ctrl+C                              |
| `yarn verificar`                                  | `yarn lint && yarn format:check && yarn test && yarn app:check`                                    | 0 verde; diferente de 0 no primeiro que falhar |
| `yarn lint`                                       | `eslint .` com o [`eslint.config.js`](../../eslint.config.js)                                      | 1 em qualquer erro                             |
| `yarn format`                                     | `prettier --write .`                                                                               | 0                                              |
| `yarn format:check`                               | `prettier --check .`                                                                               | 1 se algum arquivo não está formatado          |
| `yarn test`                                       | `vitest run`: `test/**/*.spec.js` no jsdom                                                         | 1 se algum teste falhar                        |
| `yarn app:check`                                  | o `app check` do SDK, contra este repo                                                             | 1 se alguma seção reprovar                     |

## 2. Arquivos e pastas

| Caminho                                                              | Quem escreve                              | Quem lê                                                |
| -------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------ |
| [`app.json`](../../app.json)                                         | uma pessoa, num pull request              | o RoqueOS, o `app check`, o `dev/main.js`, os testes   |
| [`src/`](../../src/)                                                 | uma pessoa                                | o Vite do RoqueOS (vai no pacote), o Vitest            |
| [`i18n/<idioma>.json`](../../i18n/)                                  | uma pessoa, os dez juntos                 | `src/textos.js`, `app check`                           |
| [`paridade.json`](../../paridade.json)                               | uma pessoa, junto da mudança que descreve | o RoqueOS, no pacote instalado                         |
| [`ASSETS.md`](../../ASSETS.md)                                       | uma pessoa                                | o `app check` (linhas do `public/`; não há `public/`)  |
| [`dev/main.js`](../../dev/main.js), [`index.html`](../../index.html) | uma pessoa                                | só o `yarn dev`                                        |
| [`test/`](../../test/)                                               | uma pessoa                                | o Vitest; `test/preparar.js` é o arquivo de preparo    |
| [`vite.config.js`](../../vite.config.js)                             | uma pessoa                                | `yarn dev`, `yarn test`; não vai no pacote             |
| [`docs/`](../)                                                       | uma pessoa                                | quem lê; não vai no pacote (`files` do `package.json`) |
| `node_modules/`, `dist/`                                             | o Yarn, o Vite                            | ignorados pelo git ([`.gitignore`](../../.gitignore))  |

O pacote que o RoqueOS instala leva só `src`, `i18n`, `app.json`, `paridade.json`, `ASSETS.md`, `LICENSE` e `README.md` (`files` do [`package.json`](../../package.json)).

## 3. Configuração

| Ajuste                                | Onde                                       | Valor / padrão                                         | Efeito                                                                |
| ------------------------------------- | ------------------------------------------ | ------------------------------------------------------ | --------------------------------------------------------------------- |
| Node                                  | `engines`, [`.nvmrc`](../../.nvmrc)        | `>=22`; o `.nvmrc` diz 24                              | o Yarn recusa Node mais velho                                         |
| gerenciador de pacotes                | `packageManager`                           | `yarn@1.22.22`                                         | o guarda do kit recusa npm e npx neste repo                           |
| `@roqueos-apps/app-sdk`               | `dependencies`                             | `github:roqueos-apps/app-sdk#v0.2.0`                   | o contrato e o `app check`                                            |
| `@roqueos-apps/ui`                    | `dependencies`                             | `github:roqueos-apps/ui#v0.6.0`                        | botões, folha, confirmação, estado vazio                              |
| `qrcode`                              | `dependencies`                             | `1.5.4`, exata                                         | o desenho; pinado na versão do RoqueOS ([CLAUDE.md](../../CLAUDE.md)) |
| `vue`                                 | `peerDependencies`                         | `^3.5.0`                                               | quem fornece é o RoqueOS                                              |
| Prettier                              | [`.prettierrc`](../../.prettierrc)         | sem ponto e vírgula, aspas simples, largura 100, LF    | `format:check`                                                        |
| o que o Prettier ignora               | [`.prettierignore`](../../.prettierignore) | `node_modules`, `yarn.lock`, `dist`, `public`          |                                                                       |
| Vitest                                | [`vite.config.js`](../../vite.config.js)   | jsdom, `test/preparar.js`, `@roqueos-apps/ui` embutido | o kit chega como fonte `.vue`                                         |
| `?idioma=`, `?leve=1`, `?convidado=1` | URL do `yarn dev`                          | idioma do navegador, normal, com conta                 | idioma, perfil leve, convidado                                        |

## 4. `app.json`

| Campo              | Valor                        | Nota                                           |
| ------------------ | ---------------------------- | ---------------------------------------------- |
| `id`               | `qrcode`                     | permanente                                     |
| `versaoDoContrato` | `1`                          | o `VERSAO_DO_CONTRATO` do SDK                  |
| `camada`           | `primeira-parte`             | app de primeira parte                          |
| `nome`             | o nome nos dez idiomas       |                                                |
| `descricao`        | a descrição nos dez idiomas  | diz "gere", nunca "escaneie"                   |
| `icone`            | `qr_code_2`                  | nome do Material Icons, desenhado pelo RoqueOS |
| `cor`              | `#8b5cf6`                    | também o `ACENTO` do `src/useQRCode.js`        |
| `categoria`        | `utilities`                  |                                                |
| `janela`           | 1080 x 720, mínimo 360 x 480 |                                                |
| `capacidades`      | `["colecoes"]`               | repetidas no `CAPACIDADES` do `src/index.js`   |
| `colecoes`         | `["historico"]`              | nome permanente                                |
| `autor`, `licenca` | `Roque Ribeiro`, `MIT`       |                                                |

## 5. A entrada do histórico

| Campo              | Tipo                     | Quem grava                           | Lido como (`lerEntrada`)             |
| ------------------ | ------------------------ | ------------------------------------ | ------------------------------------ |
| `text`             | texto                    | o app                                | `texto`; entrada vazia sai da lista  |
| `size`             | 200, 300, 500 ou 800     | o app                                | `tamanho`; outro valor vira 300      |
| `fgColor`          | `#rrggbb`                | o app                                | `frente`; outro valor vira `#000000` |
| `bgColor`          | `#rrggbb`                | o app                                | `fundo`; outro valor vira `#ffffff`  |
| `preset`           | um id de `TIPOS` ou null | o app                                | `tipo`                               |
| `criadoEm`         | ms                       | o sistema                            | `quando`                             |
| `createdAtMs`      | ms                       | o app de antes (antes de 28/09/2026) | `quando` quando falta o `criadoEm`   |
| `url`, `createdBy` | -                        | o app de antes                       | nunca lidos                          |

## 6. Constantes e saídas

| Nome                            | Arquivo                                      | Valor                                            |
| ------------------------------- | -------------------------------------------- | ------------------------------------------------ |
| exportação padrão               | [`src/index.js`](../../src/index.js)         | o app do `definirApp`                            |
| `CAPACIDADES`                   | `src/index.js`                               | `['colecoes']`                                   |
| `COLECAO`, `ACENTO`             | [`src/useQRCode.js`](../../src/useQRCode.js) | `'historico'`, `'#8b5cf6'`                       |
| `TIPOS`                         | [`src/qr.js`](../../src/qr.js)               | `url`, `email`, `phone`, `wifi`, `sms`, `text`   |
| `TAMANHOS`                      | `src/qr.js`                                  | 200, 300, 500, 800                               |
| `TAMANHO_PADRAO`                | `src/qr.js`                                  | 300                                              |
| `FRENTE_PADRAO`, `FUNDO_PADRAO` | `src/qr.js`                                  | `#000000`, `#ffffff`                             |
| `LIMITE_DO_HISTORICO`           | `src/qr.js`                                  | 50                                               |
| `CORRECOES`                     | `src/qr.js`                                  | `['M', 'L']`                                     |
| `IDIOMA_CANONICO`               | [`src/textos.js`](../../src/textos.js)       | `pt-BR`, também o recuo para idioma desconhecido |
| `IDIOMAS_COM_TEXTO`             | `src/textos.js`                              | os dez idiomas do `i18n/`                        |
| saídas do pacote                | [`package.json`](../../package.json)         | `.` para `src/index.js`, `./app.json`            |

## 7. Eventos de métrica e avisos

| O quê                                                  | Quando                                          | Fonte                         |
| ------------------------------------------------------ | ----------------------------------------------- | ----------------------------- |
| evento `qr_generate`                                   | depois que o **Gerar** desenha um código        | `gerar` no `src/useQRCode.js` |
| evento `qr_download`                                   | depois do clique no link de download            | `baixar`                      |
| aviso `entreParaGuardar` (aviso)                       | gerou sem conta, ou a coleção disse `sem-conta` | `gerar`                       |
| aviso `erroAoGuardar` (erro)                           | a coleção recusou a gravação                    | `gerar`                       |
| aviso `longoDemais` (erro)                             | o texto não cabe nem com a correção L           | `desenhar`                    |
| aviso `falhouGerar` (erro)                             | qualquer outra falha ao desenhar                | `desenhar`                    |
| avisos `imagemCopiada`, `textoCopiado`, `erroAoCopiar` | resultado do copiar                             | `copiar`                      |
| avisos `baixado`, `erroAoBaixar`                       | resultado do baixar                             | `baixar`                      |
| aviso `erroAoLimpar` (erro)                            | uma exclusão falhou durante a limpeza           | `limparHistorico`             |

Métrica que lança erro nunca derruba a ação (`metrica` no `src/useQRCode.js`).

## 8. Chaves de texto

As 48 chaves do [`i18n/pt-BR.json`](../../i18n/pt-BR.json), o idioma canônico; os outros nove arquivos têm as mesmas chaves, e o `app check` reprova chave faltando ou sobrando. Elas se dividem em: ações (`baixar`, `copiar`, `compartilhar`, `gerar`, `limpar`, `cancelar`, `fechar`), formulário (`conteudo`, `placeholder`, `tipo`, `personalizar`, `corDoCodigo`, `fundo`, `tamanho`), tipos (`tipoUrl`, `tipoEmail`, `tipoTelefone`, `tipoWifi`, `tipoSms`, `tipoTexto`), modelos (`modeloUrl`, `modeloEmail`, `modeloTelefone`, `modeloWifi`, `modeloSms`), tamanhos (`tamanhoPequeno`, `tamanhoMedio`, `tamanhoGrande`, `tamanhoHd`), histórico (`historico`, `historicoVazio`, `carregando`, `limparTitulo`, `limparTexto`), tela (`nomeDoApp`, `previa`, `imagemDoCodigo`, `digiteParaGerar`) e os avisos da seção 7.

## 9. `paridade.json`

| Campo                                            | O que guarda                                                                  |
| ------------------------------------------------ | ----------------------------------------------------------------------------- |
| `versao`, `app`                                  | `1`, `qrcode`                                                                 |
| `antes`, `auditoria`                             | onde o app de antes morava; como e quando o inventário foi feito (28/09/2026) |
| `funcionalidades[].o_que`                        | o que a pessoa fazia ou via                                                   |
| `funcionalidades[].estado`                       | `mantida`, `mudou` ou `perdida`                                               |
| `funcionalidades[].testes`                       | `test/<arquivo> › <título exato do teste>`                                    |
| `funcionalidades[].evidencia`, `nota`, `decisao` | outra prova; o que mudou; quem decidiu uma perda                              |
