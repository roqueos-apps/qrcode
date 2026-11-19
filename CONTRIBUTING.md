# How to contribute

_English | [Português](docs/pt-BR/CONTRIBUTING.md)_

Thank you for wanting to help. The common bar of the organization is in the [roqueos-apps CONTRIBUTING](https://github.com/roqueos-apps/.github/blob/main/CONTRIBUTING.md); here goes only what is QR Code's.

1. Open an issue before changing what people see or what the history stores. A small fix can go straight to the pull request.
2. Fork, create a branch and run `yarn install --ignore-scripts`.
3. Every commit carries `Signed-off-by` (`git commit -s`, the DCO). The pull request's `dco` check fails without it.
4. Every fix comes with a test that fails without it.
5. **The code is born on the device.** Do not send the QR text to any service, not even to draw the image: it can be the password of a Wi-Fi network.
6. A new history field is additive; changing the name or the meaning of an existing one (`text`, `size`, `fgColor`, `bgColor`, `preset`) erases what people had.
7. New text goes into the ten `i18n/*.json`, with the same keys. `app check` fails if a language is missing.
8. Run `yarn verificar` before opening the pull request. It is the same as CI runs. `yarn dev` opens QR Code in a fake RoqueOS window, with a local account.

Do not change the `id` in `app.json` (`qrcode`) or the collection name (`historico`): RoqueOS finds the windows, the shortcuts and the history of whoever already uses it by them.

Where each kind of change goes, and which test proves it, is in [docs/EXTENDING.md](docs/EXTENDING.md) and [docs/TESTING.md](docs/TESTING.md). A feature the old in-core app had changes [`paridade.json`](paridade.json) in the same commit.

The code, the comments and the commit messages are in Brazilian Portuguese. Issues and pull requests in English are welcome. By taking part you agree to the [code of conduct](CODE_OF_CONDUCT.md). A security problem never goes into a public issue: [SECURITY.md](SECURITY.md) has the private channel.
