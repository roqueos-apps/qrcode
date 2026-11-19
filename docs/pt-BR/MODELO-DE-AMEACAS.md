# Modelo de ameaças

_[English](../THREAT-MODEL.md) | Português_

> **Para quem:** quem revisa uma mudança que mexe no que o app manda, guarda ou importa, ou reporta uma vulnerabilidade.
> **O que tem aqui:** o que é protegido, de quem, o mecanismo de cada proteção e o que este app não protege.
> **Onde ir para o resto:** como reportar, no [SECURITY.md](../../SECURITY.md); o desenho por trás, em [ARQUITETURA.md](ARQUITETURA.md).

## Sumário

1. [O que é protegido](#1-o-que-é-protegido)
2. [De quem](#2-de-quem)
3. [As proteções e o mecanismo](#3-as-proteções-e-o-mecanismo)
4. [O que não protege](#4-o-que-não-protege)

## 1. O que é protegido

O texto de um código. Ele pode ser um link, um telefone ou a senha de uma rede Wi-Fi (`WIFI:T:WPA;S:...;P:...;;` é um modelo pronto, [`i18n/pt-BR.json`](../../i18n/pt-BR.json)). Depois, o histórico da pessoa na conta, e em terceiro lugar o próprio RoqueOS, porque o app roda na mesma origem ([SECURITY.md](../../SECURITY.md)).

## 2. De quem

| Ator                                    | O que poderia obter                                                                    |
| --------------------------------------- | -------------------------------------------------------------------------------------- |
| um serviço de imagem de terceiros       | todo texto, na URL; é o que o app de antes fazia até 28/09/2026                        |
| um pull request malicioso ou descuidado | código que manda o texto para fora, lê o banco direto ou importa o interior do RoqueOS |
| uma dependência comprometida            | código rodando no install ou na página                                                 |
| o pull request de um fork no CI         | um token com escrita, ou segredos                                                      |

## 3. As proteções e o mecanismo

| Proteção                                               | Mecanismo                                                                                                                                                                                                               |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| a imagem é desenhada no aparelho                       | o `qrcode` no navegador ([`src/qr.js`](../../src/qr.js)); o teste `nenhum arquivo de src/ tem endereço remoto no código` reprova qualquer `http(s)://` no código de `src/` ([`test/qr.spec.js`](../../test/qr.spec.js)) |
| o histórico guarda texto e escolhas, sem URL de imagem | o `camposDoHistorico` grava cinco campos; o teste `gera no aparelho e guarda no histórico só o texto, as cores, o tamanho e o tipo` trava isso                                                                          |
| a URL do terceiro no histórico antigo nunca é usada    | o `lerEntrada` não lê `url`; o teste `o histórico de antes aparece, da mais nova para a mais velha, sem usar a URL do terceiro`                                                                                         |
| sem acesso próprio a banco                             | o `app check`, seção `o app não fala com banco`, reprova import do Firebase                                                                                                                                             |
| sem o interior do RoqueOS                              | o `app check`, seção `o app não importa o RoqueOS`                                                                                                                                                                      |
| sem script de instalação                               | o `app check`, seção `scripts de instalação`; as instalações usam `--ignore-scripts`                                                                                                                                    |
| pins exatos                                            | `qrcode` em `1.5.4`, o SDK e o kit por tag, o lockfile travado no CI; o RoqueOS pina este app por tag                                                                                                                   |
| revisão em todo merge                                  | [`.github/CODEOWNERS`](../../.github/CODEOWNERS) e a conferência do DCO ([`.github/workflows/dco.yml`](../../.github/workflows/dco.yml))                                                                                |
| pull request de fork não escreve nem lê segredo        | `pull_request`, nunca `pull_request_target`; `permissions: contents: read` ([`.github/workflows/ci.yml`](../../.github/workflows/ci.yml))                                                                               |

## 4. O que não protege

- A mesma origem não é fronteira de segurança. O SDK diz isso: num app de primeira parte, as capacidades organizam o código, e a segurança vem da revisão no merge e do pin exato de versão no RoqueOS (`src/contrato.js` do `app-sdk`). Código mesclado aqui lê o que a página do RoqueOS lê.
- O texto fica guardado aberto na conta da pessoa. Quem tem acesso à conta, ou ao backend do RoqueOS, vê a senha do Wi-Fi guardada ali. Gerar sem conta deixa o texto fora do histórico.
- O PNG baixado ou compartilhado leva o texto, legível por quem escanear; depois que sai do app, é da pessoa.
- O teste de endereço remoto lê só `src/*.js` e `src/*.vue` no primeiro nível de `src/`, sem os comentários. Um endereço montado em tempo de execução, ou em outro tipo de arquivo, passaria; quem pega isso é a revisão.
- A área de transferência é do navegador: outro código no aparelho pode ler o que foi copiado.
- Nada aqui passou por teste de intrusão; não há auditoria registrada além da de paridade de 28/09/2026.
