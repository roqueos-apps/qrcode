# Testes

_[English](../TESTING.md) | Português_

> **Para quem:** quem muda o app e precisa saber que teste prova o quê, e o que quer dizer "pronto".
> **O que tem aqui:** o gate, cada suíte e o que ela prova, o critério de aceite e o que os testes não cobrem.
> **Onde ir para o resto:** quando um teste falha, [QUANDO-QUEBRA.md](QUANDO-QUEBRA.md); o inventário que cita os testes, o [`paridade.json`](../../paridade.json).

## Sumário

1. [O gate](#1-o-gate)
2. [As suítes](#2-as-suítes)
3. [Critério de aceite](#3-critério-de-aceite)
4. [O que os testes não cobrem](#4-o-que-os-testes-não-cobrem)

## 1. O gate

```bash
yarn verificar
```

Lint, Prettier, Vitest e `app check`, o mesmo no CI em todo push na `main` e todo pull request ([`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)). Medido em 18/11/2026: 3 arquivos de teste, 30 testes passando, as oito seções do `app check` em `ok`.

## 2. As suítes

| Arquivo                                                              | Testes | O que prova                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`test/qr.spec.js`](../../test/qr.spec.js)                           | 13     | nenhum endereço remoto em `src/`; o PNG é desenhado aqui, nas cores e no tamanho pedidos; texto longo demais rejeita com `longo-demais`; cabe tudo o que o serviço de antes gerava (L) e o texto curto sai com a M; o PNG para copiar e compartilhar sai sem esperar; o histórico guarda só cinco campos com os nomes de antes; entradas antigas lidas com a data do aparelho; ordem, limite e entradas vazias; detalhes de cor, tamanho, contraste, id e resumo; todo tipo tem rótulo e ícone                                                                        |
| [`test/app.spec.js`](../../test/app.spec.js)                         | 16     | o app pelo sistema falso do SDK: id e capacidades batem com o manifesto; recusa de sistema sem `colecoes`; gerar e guardar; sem conta; histórico antigo sem a URL do terceiro; barra do carregando (parada no perfil leve); abrir uma entrada sem criar outra; modelos dos tipos no idioma da pessoa; mudar a cor apaga a imagem; texto longo demais não guarda nada; limpar com confirmação, um por um; baixar com métrica; copiar imagem, recuo para texto, imagem recusada; compartilhar com arquivo, com texto, recuo para copiar; folha cancelada não copia nada |
| [`test/troca-de-idioma.spec.js`](../../test/troca-de-idioma.spec.js) | 1      | duas trocas de idioma seguidas: vale o último pedido mesmo quando a resposta dele chega antes                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `app check` (SDK)                                                    | -      | scripts de instalação, manifesto, textos nos dez idiomas, origem dos assets, sem banco, sem import do RoqueOS, variáveis CSS, capacidades opcionais declaradas                                                                                                                                                                                                                                                                                                                                                                                                        |

O preparo no [`test/preparar.js`](../../test/preparar.js) dá ao jsdom um `ResizeObserver` e um `matchMedia` que não fazem nada, e desmonta todo componente depois de cada teste.

## 3. Critério de aceite

Uma mudança está pronta quando o `yarn verificar` está verde e, se a mudança é visível, o app foi aberto no `yarn dev` com um print ([`.claude/loop.md`](../../.claude/loop.md)). Toda correção vem com um teste que reprova sem ela, e check novo passa por mutação (plante o erro, veja vermelho) ([CLAUDE.md](../../CLAUDE.md)). Teste citado no [`paridade.json`](../../paridade.json) mantém o título exato, ou o inventário muda no mesmo commit. Teste nunca é enfraquecido para o gate passar.

## 4. O que os testes não cobrem

- Um navegador de verdade: as suítes rodam no jsdom; o layout, a container query e a área de transferência real não são exercitados.
- O Safari do iPhone: só o caminho síncrono está provado, nada foi medido no aparelho ([`paridade.json`](../../paridade.json)).
- Que um PNG gerado lê de volta: a auditoria de paridade leu códigos de volta em 28/09/2026 (um Wi-Fi com ç, ã e emoji), mas nenhum teste deste repo decodifica a imagem.
- A coleção de verdade do RoqueOS, as regras e o comportamento sem rede.
- Não há suíte de ponta a ponta nem regressão visual neste repo.
