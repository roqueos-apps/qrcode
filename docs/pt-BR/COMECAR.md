# Como começar

_[English](../GETTING-STARTED.md) | Português_

> **Para quem:** quem abre este repo pela primeira vez e quer ver um QR Code desenhado por ele.
> **O que tem aqui:** os pré-requisitos e como conferir, cada passo com o comando e o sinal de que deu certo, o primeiro resultado visível e os erros de primeira vez.
> **Onde ir para o resto:** todo comando e arquivo, em [REFERENCIA.md](REFERENCIA.md); como as peças se ligam, em [ARQUITETURA.md](ARQUITETURA.md); falhas, em [QUANDO-QUEBRA.md](QUANDO-QUEBRA.md).

## Sumário

1. [Pré-requisitos](#1-pré-requisitos)
2. [Clonar e instalar](#2-clonar-e-instalar)
3. [Rodar o gate](#3-rodar-o-gate)
4. [Abrir o app](#4-abrir-o-app)
5. [O primeiro código](#5-o-primeiro-código)
6. [Erros de primeira vez](#6-erros-de-primeira-vez)

## 1. Pré-requisitos

| Ferramenta | Versão                                                                                                 | Confira com     |
| ---------- | ------------------------------------------------------------------------------------------------------ | --------------- |
| Node       | 22 ou mais novo (`engines` no [`package.json`](../../package.json)); o [`.nvmrc`](../../.nvmrc) diz 24 | `node -v`       |
| Yarn       | 1.22 (o `packageManager` é `yarn@1.22.22`)                                                             | `yarn -v`       |
| git        | qualquer um recente; as dependências vêm do GitHub por HTTPS                                           | `git --version` |

Não precisa de conta, de Firebase nem do RoqueOS clonado: o sistema de desenvolvimento do SDK troca tudo isso pelo navegador ([ARQUITETURA.md](ARQUITETURA.md#3-processos-e-onde-rodam)).

## 2. Clonar e instalar

```bash
git clone https://github.com/roqueos-apps/qrcode.git
cd qrcode
yarn install --frozen-lockfile --ignore-scripts
```

O `--frozen-lockfile` instala exatamente o que o [`yarn.lock`](../../yarn.lock) trava, e o `--ignore-scripts` não roda script de instalação de dependência nenhuma, as mesmas opções do CI ([`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)). Deu certo quando termina com:

```text
warning Ignored scripts due to flag.
Done in 2.35s.
```

O tempo é o medido em 18/11/2026 com o cache quente; o seu vai ser outro.

## 3. Rodar o gate

```bash
yarn verificar
```

Roda o lint, a conferência do Prettier, os testes do Vitest e o `app check` do SDK, nessa ordem, parando no primeiro que falhar ([`package.json`](../../package.json)). Medido em 18/11/2026 com o Node 22.23.5, termina com:

```text
 Test Files  3 passed (3)
      Tests  30 passed (30)
...
ok        capacidades opcionais declaradas

ok, o repo cumpre o contrato.
```

## 4. Abrir o app

```bash
yarn dev
```

O Vite sobe e imprime o endereço, `http://localhost:5173/` se a porta estiver livre (se não, ele tenta a próxima e avisa). Abra: o [`dev/main.js`](../../dev/main.js) monta o QR Code numa janela falsa do RoqueOS, com o tamanho do [`app.json`](../../app.json), um seletor de idioma e uma conta local (`Você`), para o histórico funcionar sem Firebase.

| Endereço                              | O que aparece                                     |
| ------------------------------------- | ------------------------------------------------- |
| `http://localhost:5173/`              | o app no idioma do navegador, com conta           |
| `http://localhost:5173/?idioma=ar-AR` | árabe, da direita para a esquerda                 |
| `http://localhost:5173/?leve=1`       | o perfil leve (a barra do carregando fica parada) |
| `http://localhost:5173/?convidado=1`  | sem conta: sem histórico                          |

## 5. O primeiro código

1. Clique em **Link**, embaixo de **Tipo**: o campo recebe `https://`.
2. Complete o endereço e clique em **Gerar QR Code**: o código aparece na prévia, com **Baixar**, **Copiar** e **Compartilhar** embaixo.
3. Clique em **Histórico**: a entrada está lá, com a miniatura. Recarregue a página (F5) e ela continua, porque o histórico de desenvolvimento fica no `localStorage`.

Esse é o primeiro resultado visível. Os rótulos acima são os do pt-BR ([`i18n/pt-BR.json`](../../i18n/pt-BR.json)); em outro idioma, são os daquele idioma. O servidor de desenvolvimento subiu e respondeu em 18/11/2026; os cliques acima não foram repetidos num navegador nessa sessão, e seguem o que o [`test/app.spec.js`](../../test/app.spec.js) prova pelo sistema falso.

## 6. Erros de primeira vez

| O que aparece                                         | O que fazer                                                                                             |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `The engine "node" is incompatible with this module.` | `nvm use` (o Node 24 do `.nvmrc`), veja o [QUANDO-QUEBRA.md](QUANDO-QUEBRA.md#2-instalar)               |
| `Your lockfile needs to be updated`                   | alguém mudou o `package.json` sem o `yarn.lock`; veja o [QUANDO-QUEBRA.md](QUANDO-QUEBRA.md#2-instalar) |
| `Port 5173 is in use, trying another one...`          | não é erro: abra o endereço que o Vite imprime em seguida                                               |
| `[warn] ... Code style issues found`                  | `yarn format`, depois o commit; veja o [QUANDO-QUEBRA.md](QUANDO-QUEBRA.md#3-o-gate)                    |
