# Documentação do QR Code

_[English](../INDEX.md) | Português_

O QR Code do RoqueOS: desenha o código no aparelho, guarda o histórico na conta da pessoa pelo `app-sdk`, e roda igual dentro do RoqueOS, sozinho no navegador e no teste. Para quem muda o app, revisa um pull request ou liga o app no RoqueOS.

Por onde começar depende do que você quer.

| Quero...                                            | Leia                                                                                      |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Instalar e ver o código na tela**                 | [COMECAR.md](COMECAR.md): do zero ao primeiro resultado                                   |
| **Ver como é por dentro**                           | [ARQUITETURA.md](ARQUITETURA.md): contexto, componentes, fluxos, dados, decisões, limites |
| **Consultar um comando, arquivo, campo ou chave**   | [REFERENCIA.md](REFERENCIA.md)                                                            |
| **Manter e publicar uma versão**                    | [OPERACAO.md](OPERACAO.md): rotina, publicar, atualizar, desfazer                         |
| **Entender uma falha**                              | [QUANDO-QUEBRA.md](QUANDO-QUEBRA.md): sintoma, causa, o que fazer                         |
| **Acrescentar um tipo, um tamanho ou um texto**     | [ESTENDER.md](ESTENDER.md)                                                                |
| **Saber como o RoqueOS o monta e o que ele recebe** | [INTEGRACOES.md](INTEGRACOES.md)                                                          |
| **Saber o que protege e o que não protege**         | [MODELO-DE-AMEACAS.md](MODELO-DE-AMEACAS.md)                                              |
| **Saber o que os testes provam**                    | [TESTES.md](TESTES.md)                                                                    |
| **Achar um termo**                                  | [GLOSSARIO.md](GLOSSARIO.md)                                                              |
| **Contribuir**                                      | [CONTRIBUTING.md](CONTRIBUTING.md)                                                        |
| **Ver o que mudou**                                 | [CHANGELOG.md](../../CHANGELOG.md)                                                        |
| **Reportar uma vulnerabilidade**                    | [SECURITY.md](../../SECURITY.md)                                                          |
| **Começar pela capa**                               | [README.pt-BR.md](../../README.pt-BR.md)                                                  |

## Diagramas

| Diagrama                           | Fonte                                            | Explicado em                                                         |
| ---------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------- |
| A capa (print, não diagrama)       | [`capa.jpg`](../capa.jpg), origem no `ASSETS.md` | [README.pt-BR.md](../../README.pt-BR.md)                             |
| As partes e o RoqueOS              | Mermaid no Markdown                              | [README.pt-BR.md](../../README.pt-BR.md#as-partes)                   |
| Contexto: quem usa, do que depende | Mermaid no Markdown                              | [ARQUITETURA.md, seção 2](ARQUITETURA.md#2-contexto)                 |
| Montar o app                       | Mermaid no Markdown                              | [ARQUITETURA.md, seção 5.1](ARQUITETURA.md#51-montar)                |
| Gerar e guardar um código          | Mermaid no Markdown                              | [ARQUITETURA.md, seção 5.2](ARQUITETURA.md#52-gerar-e-guardar)       |
| Copiar e compartilhar              | Mermaid no Markdown                              | [ARQUITETURA.md, seção 5.3](ARQUITETURA.md#53-copiar-e-compartilhar) |

Os programas e o código são em português; mensagem, comando e chave aparecem como estão.
