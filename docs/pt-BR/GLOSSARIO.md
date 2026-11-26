# Glossário

_[English](../GLOSSARY.md) | Português_

> **Para quem:** quem lê o código e encontra uma palavra que aqui quer dizer uma coisa específica.
> **O que tem aqui:** cada termo como aparece no código, o que ele é e onde mora.
> **Onde ir para o resto:** o valor de cada constante, em [REFERENCIA.md](REFERENCIA.md); como as peças se ligam, em [ARQUITETURA.md](ARQUITETURA.md).

| Termo                           | O que é                                                                                                                   | Onde mora                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `sistema`                       | o objeto que o RoqueOS (ou o sistema de desenvolvimento, ou o falso) entrega ao app; o único jeito de falar com o RoqueOS | `app-sdk`; recebido no [`src/index.js`](../../src/index.js)                           |
| capacidade                      | uma parte do `sistema` (`idioma`, `avisar`, `metricas`, `colecoes`...); as opcionais precisam ser declaradas              | `capacidades` no [`app.json`](../../app.json)                                         |
| `colecoes`                      | a capacidade que guarda documentos na conta da pessoa, em tempo real                                                      | `sistema.colecoes.abrir('historico')` no [`src/useQRCode.js`](../../src/useQRCode.js) |
| `historico`                     | a coleção deste app; o RoqueOS mapeia para `users/{uid}/qrCodes`                                                          | `COLECAO` no `src/useQRCode.js`                                                       |
| entrada                         | um item do histórico: texto, tamanho, cores e tipo                                                                        | `camposDoHistorico`, `lerEntrada` no [`src/qr.js`](../../src/qr.js)                   |
| `tipo` / `preset`               | o tipo de conteúdo (`url`, `email`, `phone`, `wifi`, `sms`, `text`); `preset` é o nome do campo gravado                   | `TIPOS` no `src/qr.js`                                                                |
| modelo                          | o texto que um tipo põe no campo, no idioma da pessoa (`modeloWifi`...)                                                   | [`i18n/`](../../i18n/)                                                                |
| `frente` / `fundo`              | a cor do código e a cor do fundo (`fgColor` / `bgColor` quando gravadas)                                                  | `src/qr.js`                                                                           |
| correção                        | o nível de correção de erro do QR; a M primeiro, a L quando a M não cabe                                                  | `CORRECOES` no `src/qr.js`                                                            |
| `longo-demais`                  | o `codigo` do erro quando o texto não cabe nem com a L                                                                    | `gerarImagem` no `src/qr.js`                                                          |
| `sem-conta`                     | o código de erro do SDK quando a gravação precisa de conta e ninguém entrou                                               | tratado no `gerar`, `src/useQRCode.js`                                                |
| modo leve / perfil leve         | o perfil do aparelho fraco; a barra do carregando fica parada                                                             | `sistema.desempenho.modoLeve()`, `?leve=1`                                            |
| janela falsa                    | a janela de desenvolvimento do SDK que o `yarn dev` abre                                                                  | [`dev/main.js`](../../dev/main.js)                                                    |
| sistema falso                   | o sistema em memória do SDK que os testes usam                                                                            | [`test/app.spec.js`](../../test/app.spec.js)                                          |
| `app check`                     | o comando do SDK que confere um repo contra o contrato                                                                    | `yarn app:check`                                                                      |
| `verificar`                     | o gate: lint, formato, testes e `app check`                                                                               | [`package.json`](../../package.json)                                                  |
| paridade                        | o inventário do que o app de antes, no núcleo, fazia e do que aconteceu com cada coisa                                    | [`paridade.json`](../../paridade.json)                                                |
| `mantida` / `mudou` / `perdida` | os três estados de um item de paridade                                                                                    | `paridade.json`                                                                       |
| núcleo                          | o repo fechado do RoqueOS onde o app morou até 28/09/2026                                                                 | [README.pt-BR.md](../../README.pt-BR.md)                                              |
| primeira parte                  | app feito pela casa, montado na mesma origem do RoqueOS                                                                   | `camada` no `app.json`                                                                |
| acento                          | a cor do app `#8b5cf6`, passada aos componentes do kit e como `--qr-acento`                                               | `ACENTO` no `src/useQRCode.js`                                                        |
| folha                           | a folha que sobe de baixo, do kit (`RosFolha`), onde o histórico abre                                                     | [`src/QRCode.vue`](../../src/QRCode.vue)                                              |
| DCO                             | Developer Certificate of Origin: a linha `Signed-off-by` que todo commit precisa ter                                      | [`.github/workflows/dco.yml`](../../.github/workflows/dco.yml)                        |
