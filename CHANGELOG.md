# Changelog

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e o projeto usa
[versionamento semântico](https://semver.org/lang/pt-BR/).

## [0.1.0] - 2026-09-28

O QR Code sai do RoqueOS (Onda 4b do Goal 28), no app-sdk 0.2.0 e no kit `ui` 0.2.0.

### Mudado

- **O código é desenhado no aparelho**, pelo pacote `qrcode`. O app de antes pedia a imagem a
  `api.qrserver.com` com o texto na URL e guardava essa URL no histórico: a senha de um Wi-Fi
  em QR passava por um terceiro.
- O histórico guarda só o texto, as cores, o tamanho e o tipo, com os nomes de campo de antes;
  a URL da imagem e os dados da conta não são mais gravados. As miniaturas são desenhadas no
  aparelho.
- Sem conta o código é gerado do mesmo jeito; só o histórico fica de fora. Antes, sem conta,
  nada era gerado.
- **Copiar** copia a imagem (ou o texto do código, onde o navegador não copia imagem), e não
  mais a URL do terceiro. **Compartilhar** manda o PNG.
- Abrir uma entrada do histórico desenha o código sem criar outra entrada.
- Os modelos de cada tipo (e-mail, telefone, Wi-Fi, SMS) vêm no idioma da pessoa, e os nomes
  dos tipos estão nos dez idiomas (antes, em português em todos).
- As cores pelo seletor de cor do navegador, no lugar do do Quasar.
- A descrição dizia "Gere e escaneie QR Codes"; o app nunca leu QR Code. Agora diz o que ele faz,
  nos dez idiomas (antes em inglês em oito).

### Adicionado

- Aviso quando o texto é longo demais para um QR Code.
- O tamanho HD (800 px) com rótulo nos dez idiomas.
