# Operação

_[English](../OPERATIONS.md) | Português_

> **Para quem:** quem mantém o app: responde pull request, move dependência, corta uma versão e leva ela para o RoqueOS.
> **O que tem aqui:** a rotina, cortar uma versão, atualizar sem quebrar, desfazer cada passo, backup e restauração, e o que acompanhar.
> **Onde ir para o resto:** os comandos um a um, em [REFERENCIA.md](REFERENCIA.md); o que cada falha quer dizer, em [QUANDO-QUEBRA.md](QUANDO-QUEBRA.md).

## Sumário

1. [A rotina](#1-a-rotina)
2. [Cortar uma versão](#2-cortar-uma-versão)
3. [Atualizar sem quebrar](#3-atualizar-sem-quebrar)
4. [Desfazer](#4-desfazer)
5. [Backup e restauração](#5-backup-e-restauração)
6. [O que acompanhar](#6-o-que-acompanhar)

## 1. A rotina

Não há horário nem nada rodando: o app não tem servidor. A rotina é a do [`.claude/loop.md`](../../.claude/loop.md), uma coisa por iteração, parando na primeira que tiver trabalho, com a evidência colada no chat:

1. Gate vermelho: `yarn verificar`, conserta e cola a saída.
2. CI do GitHub vermelho: `gh run list --limit 3`. Vermelho lá e verde aqui é ambiente divergente, e se investiga antes de qualquer outra coisa.
3. Pull request sem `Signed-off-by`: o workflow `dco` reprova; quem contribui recebe o comando que conserta (`git rebase --signoff main`).
4. Issue ou pull request de fora sem resposta: `gh issue list` e `gh pr list`.
5. Asset sem origem: arquivo novo em `public/` precisa de linha no [`ASSETS.md`](../../ASSETS.md). O app não tem `public/` hoje.
6. SDK atrás: tag nova do `app-sdk` com capacidade que o app usa vira bump.
7. Drift de docs: README, CONTRIBUTING e `app.json` dizem a mesma coisa sobre o que o app faz, as capacidades que pede e os idiomas.

Mudança visível não fecha sem o app aberto de verdade (`yarn dev`) e um print, e no RoqueOS quando a mudança chega lá ([`.claude/loop.md`](../../.claude/loop.md)).

## 2. Cortar uma versão

O repo não tem script de release nem workflow de tag. Uma versão é o número no [`package.json`](../../package.json), uma entrada no [`CHANGELOG.md`](../../CHANGELOG.md) e uma tag `vX.Y.Z` num commit da `main`, que o RoqueOS então pina:

```bash
# num branch: versão no package.json, a entrada do CHANGELOG, o paridade.json se uma funcionalidade mudou
yarn verificar
git commit -s -m "chore: versao 0.1.2"
# abra o PR; depois do merge, na main:
git switch main && git pull
git tag v0.1.2
git push origin v0.1.2
```

O número de versão acima é exemplo. Depois, no RoqueOS, a linha `@roqueos-apps/qrcode` do `package.json` dele passa para a tag nova; em 18/11/2026 o clone local do front do RoqueOS pinava `#v0.1.1`. O RoqueOS confere o [`paridade.json`](../../paridade.json) no pacote instalado antes de aceitar a versão: teste citado que não existe mais, item em dúvida ou perda sem decisão escrita reprovam ([README.pt-BR.md](../../README.pt-BR.md)). Este clone não tem as tags baixadas, então as tags que existem (`v0.1.0`, `v0.1.1`, citadas no [`CHANGELOG.md`](../../CHANGELOG.md)) não foram conferidas com `git tag` aqui.

## 3. Atualizar sem quebrar

| Mudança                                     | O que precisa continuar valendo                                                                                                                                  |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app-sdk` para uma tag nova                 | `yarn verificar` verde, `app check` incluído; o changelog diz o que mudou ([`.claude/loop.md`](../../.claude/loop.md))                                           |
| `ui` para uma tag nova                      | `yarn verificar` verde e o app aberto no `yarn dev`; o kit chega como fonte `.vue`                                                                               |
| pacote `qrcode`                             | fica na versão exata que o RoqueOS usa ([CLAUDE.md](../../CLAUDE.md)); os testes de tamanho e cor do [`test/qr.spec.js`](../../test/qr.spec.js) continuam verdes |
| um campo do histórico                       | só aditivo; renomear `text`, `size`, `fgColor`, `bgColor` ou `preset` apaga o que a pessoa tinha ([CONTRIBUTING.md](CONTRIBUTING.md))                            |
| uma funcionalidade que o app de antes tinha | atualize o [`paridade.json`](../../paridade.json) no mesmo commit                                                                                                |
| um texto                                    | nos dez `i18n/*.json`, com as mesmas chaves                                                                                                                      |

Instale com `yarn install --frozen-lockfile --ignore-scripts` depois de qualquer mudança de dependência e faça o commit do `package.json` e do `yarn.lock` juntos.

## 4. Desfazer

| Passo                              | Como desfazer                                                                                                                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| tag empurrada no commit errado     | antes de alguém pinar: `git push origin :refs/tags/vX.Y.Z`, `git tag -d vX.Y.Z`, marque o commit certo e empurre. Depois que o RoqueOS pinou, não mova: corte uma versão de correção |
| versão que quebra no RoqueOS       | o RoqueOS volta para a tag anterior no `package.json` dele; aqui, `git revert` na `main` e tag nova                                                                                  |
| mudança mesclada que quebra o gate | `git revert -s <commit>` num pull request                                                                                                                                            |
| Limpar o histórico, para a pessoa  | não há desfazer no app: a confirmação é a única proteção ([`src/QRCode.vue`](../../src/QRCode.vue))                                                                                  |

## 5. Backup e restauração

O repo é a fonte e mora no GitHub; um clone mais o `yarn install --frozen-lockfile --ignore-scripts` restaura tudo. O histórico das pessoas não está aqui: mora nas contas delas no RoqueOS (`users/{uid}/qrCodes`), e o backup é do RoqueOS. O histórico de desenvolvimento é só o `localStorage` do navegador, descartável de propósito.

## 6. O que acompanhar

| O quê                    | Saudável                                                                    | Como olhar                             |
| ------------------------ | --------------------------------------------------------------------------- | -------------------------------------- |
| o gate                   | `ok, o repo cumpre o contrato.` e 30 testes passando (medido em 18/11/2026) | `yarn verificar`                       |
| o CI na `main`           | `verificar` verde                                                           | `gh run list --limit 3`                |
| os pull requests         | `dco` verde em cada um                                                      | `gh pr checks <número>`                |
| o pin no RoqueOS         | a tag mais nova daqui é a que o RoqueOS pina                                | o `package.json` do RoqueOS            |
| o inventário de paridade | 0 `perdida` sem `decisao`                                                   | [`paridade.json`](../../paridade.json) |

O app manda `qr_generate` e `qr_download` para as métricas do RoqueOS; onde elas são lidas é assunto do RoqueOS, não deste repo.
