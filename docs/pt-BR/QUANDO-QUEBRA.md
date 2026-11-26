# Quando quebra

_[English](../WHEN-IT-BREAKS.md) | Português_

> **Para quem:** quem viu a instalação, o gate, o `app check`, o app ou uma versão falhar e quer a causa e o conserto.
> **O que tem aqui:** o primeiro comando de diagnóstico, depois uma tabela por área com o que aparece, a causa e o que fazer.
> **Onde ir para o resto:** os formatos que cada conferência lê, em [REFERENCIA.md](REFERENCIA.md); por que cada regra existe, em [ARQUITETURA.md](ARQUITETURA.md#8-decisões-de-design).

## Sumário

1. [Primeiro, o diagnóstico](#1-primeiro-o-diagnóstico)
2. [Instalar](#2-instalar)
3. [O gate](#3-o-gate)
4. [`app check`](#4-app-check)
5. [O app na tela](#5-o-app-na-tela)
6. [Publicar e o RoqueOS](#6-publicar-e-o-roqueos)

Os programas imprimem em português (o Yarn, o Vite e o Prettier em inglês); as mensagens abaixo estão como aparecem. Salvo quando a linha diz outra coisa, cada mensagem foi reproduzida em 18/11/2026 numa cópia descartável do repo, plantando a causa.

## 1. Primeiro, o diagnóstico

```bash
yarn verificar        # onde o gate para: lint, formato, testes, app check, nessa ordem
yarn app:check        # todas as seções do app check de uma vez, nunca só a primeira
```

O `yarn verificar` para no primeiro passo que falhar; o `app check` imprime todo problema de toda seção e sai 1 se houver algum. No app, o console prefixa todo erro com `[qrcode]` ([`src/useQRCode.js`](../../src/useQRCode.js)).

## 2. Instalar

| O que aparece                                                                                                    | Causa                                                                        | O que fazer                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| ``error Your lockfile needs to be updated, but yarn was run with `--frozen-lockfile`.``                          | `package.json` e `yarn.lock` divergem                                        | instale sem a opção só se a mudança de dependência é de propósito, e faça o commit dos dois juntos                                   |
| `error @roqueos-apps/qrcode@0.1.1: The engine "node" is incompatible with this module. Expected version ">=22".` | Node mais velho que o 22 (`engines` no [`package.json`](../../package.json)) | `nvm use` (o [`.nvmrc`](../../.nvmrc) diz 24); reproduzido com um `engines` falso                                                    |
| `Permission denied (publickey)` ao baixar o `@roqueos-apps/ui`                                                   | o kit vinha por `git+ssh` e a máquina não tinha chave                        | já consertado: o kit vem por HTTPS (`github:roqueos-apps/ui#v0.6.0`); visto no CI em 29/09/2026 ([CHANGELOG.md](../../CHANGELOG.md)) |

## 3. O gate

| O que aparece                                                                                                                         | Causa                                                                        | O que fazer                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `[warn] Code style issues found in the above file. Run Prettier with --write to fix.`                                                 | um arquivo (Markdown incluído) fora do formato do Prettier                   | `yarn format`, revise o diff, faça o commit                                                                                  |
| `× o texto não sai do aparelho > nenhum arquivo de src/ tem endereço remoto no código`, com `expected [ 'qr.js' ] to deeply equal []` | um endereço `http://` ou `https://` no código de `src/` (comentário pode)    | tire: o código é desenhado no aparelho e nada vai para terceiro ([`test/qr.spec.js`](../../test/qr.spec.js))                 |
| `o id e as capacidades são os do manifesto, e o manifesto é válido` falhando                                                          | o `CAPACIDADES` do `src/index.js` e o `capacidades` do `app.json` divergiram | mude as duas listas no mesmo commit (não reproduzido; lido do [`test/app.spec.js`](../../test/app.spec.js))                  |
| `'vue/no-undef-components'` do ESLint                                                                                                 | componente usado sem import                                                  | importe do `@roqueos-apps/ui`: fora do RoqueOS não há Quasar ([`eslint.config.js`](../../eslint.config.js)); não reproduzido |

## 4. `app check`

| O que aparece                                                                                          | Causa                                          | O que fazer                                                                  |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------- | ---------------------------------------------------------------------------- |
| `package.json declara "postinstall", que roda sozinho no install de quem depende deste pacote`         | um script de instalação no `package.json`      | tire; o RoqueOS instala o pacote e rodaria o script                          |
| `i18n/de-DE.json sem: baixar`                                                                          | chave do `pt-BR.json` faltando em outro idioma | ponha nos dez arquivos                                                       |
| `src/qr.scss:318 usa --ros-foo, que não está entre as variáveis do sistema que um app pode usar (...)` | variável `--ros-*` fora do contrato do SDK     | use só as da lista, ou uma variável do app `--qr-*`                          |
| `src/useQRCode.js:30 usa sistema.arquivos sem "arquivos" em capacidades no app.json`                   | capacidade opcional usada sem ser declarada    | declare no `app.json` e no `CAPACIDADES`, ou não use                         |
| `... importa "firebase": o app não fala com banco, quem guarda é o sistema`                            | import do Firebase                             | use a capacidade `colecoes`; não reproduzido, mensagem lida do SDK instalado |

Os números de arquivo e linha acima são os do erro plantado; os seus vão ser outros.

## 5. O app na tela

| O que aparece                                                                   | Causa                                                                      | O que fazer                                                                                                               |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `[qrcode] o sistema não cumpre o contrato: falta a capacidade "colecoes"`       | o sistema que montou o app não tem `colecoes`                              | monte num RoqueOS (ou sistema do SDK) que ofereça a capacidade; provado pelo [`test/app.spec.js`](../../test/app.spec.js) |
| aviso `O texto é longo demais para caber num QR Code.`                          | o texto não cabe nem com a correção L (acima de 2.953 bytes)               | encurte o texto; não é defeito                                                                                            |
| aviso `Entre na sua conta para guardar no histórico.`                           | sem conta, ou a coleção respondeu `sem-conta`                              | entre na conta; o código na tela vale do mesmo jeito                                                                      |
| aviso `Erro ao salvar no histórico` e `[qrcode] histórico recusado:` no console | a coleção recusou a gravação                                               | o console traz o erro do sistema e o `codigo` dele                                                                        |
| Copiar cola texto em vez da imagem                                              | o navegador não tem `ClipboardItem` ou recusou a imagem                    | recuo esperado ([`src/useQRCode.js`](../../src/useQRCode.js), `copiar`)                                                   |
| Copiar ou Compartilhar não faz nada no Safari do iPhone                         | um `await` antes da chamada sai do toque (consertado na 0.1.1, 28/09/2026) | mantenha o `pngDaImagem` síncrono; uma regressão aparece aqui                                                             |
| o Esc não fecha mais o histórico depois do Limpar                               | o botão virou `disabled` e o foco foi para o `body` (QA, 28/09/2026)       | mantenha o `aria-disabled` no Limpar ([`src/QRCode.vue`](../../src/QRCode.vue))                                           |
| `Port 5173 is in use, trying another one...` no `yarn dev`                      | outro Vite está usando a porta                                             | abra o endereço que o Vite imprime em seguida                                                                             |

## 6. Publicar e o RoqueOS

| O que aparece                                              | Causa                                                                                                                                      | O que fazer                                                                                                    |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| o RoqueOS recusa a versão nova pelo inventário de paridade | um teste citado no [`paridade.json`](../../paridade.json) foi renomeado ou apagado, um item está em dúvida, ou uma perda não tem `decisao` | atualize o `paridade.json` no mesmo commit da mudança ([README.pt-BR.md](../../README.pt-BR.md))               |
| o build do RoqueOS quebra ao importar o app                | `import` direto de um arquivo JSON em `src/`                                                                                               | use `?raw` e `JSON.parse` como o [`src/textos.js`](../../src/textos.js) (medido nos jogos, 25/09/2026)         |
| um histórico antigo some                                   | um campo do histórico foi renomeado                                                                                                        | desfaça a troca de nome; os nomes dos campos são permanentes                                                   |
| o `dco` reprova com `commit ... sem Signed-off-by.`        | um commit sem `Signed-off-by`                                                                                                              | `git rebase --signoff main` e empurre de novo ([`.github/workflows/dco.yml`](../../.github/workflows/dco.yml)) |
