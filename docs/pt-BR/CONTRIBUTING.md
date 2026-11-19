# Como contribuir

_[English](../../CONTRIBUTING.md) | Português_

Obrigado por querer ajudar. A régua comum da organização está no [CONTRIBUTING da roqueos-apps](https://github.com/roqueos-apps/.github/blob/main/CONTRIBUTING.md); aqui entra só o que é do QR Code.

1. Abra uma issue antes de mudar o que a pessoa vê ou o que o histórico guarda. Correção pequena pode ir direto para o PR.
2. Faça o fork, crie um branch e rode `yarn install --ignore-scripts`.
3. Todo commit leva `Signed-off-by` (`git commit -s`, o DCO). O check `dco` do pull request reprova sem.
4. Toda correção vem com um teste que reprova sem ela.
5. **O código nasce no aparelho.** Não mande o texto do QR para serviço nenhum, nem para desenhar a imagem: ele pode ser a senha de um Wi-Fi.
6. Campo novo no histórico é aditivo; mudar o nome ou o sentido de um que existe (`text`, `size`, `fgColor`, `bgColor`, `preset`) apaga o que a pessoa tinha.
7. Texto novo entra nos dez `i18n/*.json`, com as mesmas chaves. O `app check` reprova se faltar um idioma.
8. Rode `yarn verificar` antes de abrir o PR. É o mesmo que o CI roda. `yarn dev` abre o QR Code numa janela falsa do RoqueOS, numa conta local.

Não mude o `id` do `app.json` (`qrcode`) nem o nome da coleção (`historico`): é por eles que o RoqueOS acha as janelas, os atalhos e o histórico de quem já usa.

Onde entra cada tipo de mudança, e que teste prova, está em [ESTENDER.md](ESTENDER.md) e [TESTES.md](TESTES.md). Funcionalidade que o app de antes, no núcleo, tinha muda o [`paridade.json`](../../paridade.json) no mesmo commit.

O código, os comentários e as mensagens de commit são em português do Brasil. Issue e PR em inglês são bem-vindos. Ao participar você concorda com o [código de conduta](../../CODE_OF_CONDUCT.md). Falha de segurança nunca vai em issue pública: o [SECURITY.md](../../SECURITY.md) tem o canal privado.
