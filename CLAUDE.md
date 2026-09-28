# QR Code

App da organização roqueos-apps, montado pelo RoqueOS através do `app-sdk`. Leia o README
antes de mudar qualquer coisa.

- Gate: `yarn verificar` (o mesmo do CI e do pre-push).
- O app só importa `vue`, `@roqueos-apps/app-sdk`, `@roqueos-apps/ui`, `qrcode` e arquivo deste
  repo. O `app check` e a catraca `apps-fora-do-nucleo` do RoqueOS reprovam o resto. `qrcode`
  fica na versão exata do RoqueOS.
- **O código nasce no aparelho.** Nada de serviço de terceiros para desenhar o QR: o texto pode
  ser a senha de um Wi-Fi. `test/qr.spec.js` reprova endereço remoto no código-fonte.
- O histórico é a coleção `historico` (`users/{uid}/qrCodes` no RoqueOS). Os nomes dos campos
  (`text`, `size`, `fgColor`, `bgColor`, `preset`) são os de antes da saída e são permanentes;
  o histórico não guarda imagem nem URL.
- JSON de texto entra com `?raw` e `JSON.parse` (`src/textos.js`): o build do RoqueOS quebra
  com import de JSON direto, e é por isso que `src/index.js` repete as capacidades do
  `app.json` (o teste confere que batem).
- O `id` do `app.json` (`qrcode`) e o nome da coleção (`historico`) são permanentes.
- Do tema do RoqueOS só as variáveis CSS do contrato do SDK; as cores do app são `--qr-*`.
- Toda correção vem com teste que reprova sem ela; check novo passa por mutação.
- Todo commit com `Signed-off-by` (`git commit -s`): o workflow `dco` reprova sem.
- Português do Brasil no código e nos commits.
