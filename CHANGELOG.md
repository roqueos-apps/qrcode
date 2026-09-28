# Changelog

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e o projeto usa
[versionamento semântico](https://semver.org/lang/pt-BR/).

## [0.1.1] - 2026-09-28

A auditoria de paridade de 28/09/2026 (Goal 28): o founder pediu que nenhuma funcionalidade
se perdesse na saída do núcleo.

### Adicionado

- `paridade.json`: o inventário do que o QR Code fazia dentro do RoqueOS, item por item, e o que
  aconteceu com cada coisa na saída (55 itens: 37 mantidas, 18 mudaram, 0 perdidas). Cada item
  cita o teste deste repo que o prova, ou a evidência, e o RoqueOS confere o arquivo no pacote
  instalado: teste citado que não existe mais, estado de dúvida ou perda sem decisão escrita
  reprovam. O arquivo vai no pacote (`files`).

### Corrigido

- **Texto de 2.332 a 2.953 bytes volta a caber.** A correção de erro estava fixa na M; o
  serviço de antes usava a L. Agora tenta a M (que aguenta o código riscado) e cai para a L
  quando o texto não cabe.
- **Copiar e Compartilhar no Safari do iPhone**: nada é esperado antes de chamar a área de
  transferência e a folha de compartilhar (o PNG sai da imagem sem `await`), porque o Safari
  só aceita as duas dentro do toque. A imagem recusada na área de transferência cai no texto
  do código.
- **Compartilhar leva o texto do código junto do PNG**, e o aparelho que não compartilha
  arquivo abre a folha com o texto, como antes; sem folha nenhuma, copia.

### Mudado

- O histórico que ainda não chegou mostra a barra do carregando (o spinner de antes), e a
  folha do histórico fecha também arrastando a alça (kit `ui` 0.6.0).

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
