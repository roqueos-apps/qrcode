# Segurança

## Como reportar

Não abra issue pública para falha de segurança. Use o
[relatório privado de vulnerabilidade](https://github.com/roqueos-apps/qrcode/security/advisories/new)
do GitHub. A resposta vem em até sete dias. A política completa está no
[SECURITY da roqueos-apps](https://github.com/roqueos-apps/.github/blob/main/SECURITY.md).

## O que vale aqui

O QR Code roda **na mesma origem** do RoqueOS, e o texto de um código pode ser segredo (a senha
de um Wi-Fi). O que protege quem usa o RoqueOS é:

- o código é desenhado no aparelho pelo pacote `qrcode`; o texto não sai para serviço nenhum,
  e o teste reprova endereço remoto no código-fonte do app;
- o histórico guarda o texto, as cores e o tamanho, na conta da pessoa, pela coleção do
  sistema, que decide onde ela mora e com que regra; o `app check` reprova import do Firebase
  ou de dentro do RoqueOS;
- todo merge passa pela revisão do mantenedor (`CODEOWNERS`), e todo commit tem
  `Signed-off-by`;
- o RoqueOS instala o app por uma tag exata, com o commit travado no lockfile, e o `qrcode` é
  pinado na mesma versão que o RoqueOS usa;
- nenhum script roda sozinho no install, e o CI de pull request não lê segredo nenhum.

---

## Security (English)

Do not open public issues for vulnerabilities; use GitHub's private vulnerability reporting.
QR Code runs on the same origin as RoqueOS, and a code's text can be a secret (a Wi-Fi
password): the image is drawn on the device by the `qrcode` package and the text is never sent
anywhere (tests fail on remote addresses in the app's source). The history lives in the
person's account through the system's collection; the app has no database access of its own,
is pinned by exact tag, pins `qrcode` to RoqueOS's version, and has no install-time scripts or
CI secrets.
