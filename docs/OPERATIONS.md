# Operations

_English | [Português](pt-BR/OPERACAO.md)_

> **Who it is for:** whoever maintains the app: answers pull requests, moves dependencies, cuts a version and gets it into RoqueOS.
> **What is here:** the routine, cutting a release, updating without breaking, undoing each step, backup and restore, and what to watch.
> **Where to go for the rest:** the commands one by one, in [REFERENCE.md](REFERENCE.md); what each failure means, in [WHEN-IT-BREAKS.md](WHEN-IT-BREAKS.md).

## Contents

1. [The routine](#1-the-routine)
2. [Cutting a release](#2-cutting-a-release)
3. [Updating without breaking](#3-updating-without-breaking)
4. [Undoing](#4-undoing)
5. [Backup and restore](#5-backup-and-restore)
6. [What to monitor](#6-what-to-monitor)

## 1. The routine

There is no schedule and nothing running: the app has no server. The routine is the one in [`.claude/loop.md`](../.claude/loop.md), one thing per iteration, stopping at the first that has work, with the evidence pasted in the chat:

1. Gate red: `yarn verificar`, fix it and paste the output.
2. GitHub CI red: `gh run list --limit 3`. Red there and green locally is a diverging environment, and it is investigated before anything else.
3. A pull request without `Signed-off-by`: the `dco` workflow fails it; the contributor gets the command that fixes it (`git rebase --signoff main`).
4. An issue or pull request from outside without an answer: `gh issue list` and `gh pr list`.
5. An asset without origin: a new file in `public/` needs a row in [`ASSETS.md`](../ASSETS.md). The app has no `public/` today.
6. SDK behind: a new `app-sdk` tag with a capability the app uses becomes a bump.
7. Docs drift: README, CONTRIBUTING and `app.json` say the same thing about what the app does, the capabilities it asks for and the languages.

A visible change is not done without the app actually open (`yarn dev`) and a screenshot, and in RoqueOS when the change gets there ([`.claude/loop.md`](../.claude/loop.md)).

## 2. Cutting a release

The repo has no release script and no tag workflow. A release is a version in [`package.json`](../package.json), an entry in [`CHANGELOG.md`](../CHANGELOG.md) and a `vX.Y.Z` tag on a commit of `main`, which RoqueOS then pins:

```bash
# on a branch: version in package.json, the CHANGELOG entry, paridade.json if a feature changed
yarn verificar
git commit -s -m "chore: versao 0.1.2"
# open the PR; after the merge, on main:
git switch main && git pull
git tag v0.1.2
git push origin v0.1.2
```

The version number above is an example. Then, in RoqueOS, the `@roqueos-apps/qrcode` line of its `package.json` moves to the new tag; on 18/11/2026 the local RoqueOS front clone pinned `#v0.1.1`. RoqueOS checks [`paridade.json`](../paridade.json) in the installed package before accepting the version: a cited test that no longer exists, an item in doubt or a loss without a written decision fail it ([README.md](../README.md)). This clone has no tags fetched, so the existing tags (`v0.1.0`, `v0.1.1`, named in [`CHANGELOG.md`](../CHANGELOG.md)) were not checked against `git tag` here.

## 3. Updating without breaking

| Change                    | What must hold                                                                                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app-sdk` to a new tag    | `yarn verificar` green, `app check` included; the changelog says what changed ([`.claude/loop.md`](../.claude/loop.md))                                  |
| `ui` to a new tag         | `yarn verificar` green and the app opened in `yarn dev`; the kit arrives as `.vue` source                                                                |
| `qrcode` package          | stays at the exact version RoqueOS uses ([CLAUDE.md](../CLAUDE.md)); the size and color tests in [`test/qr.spec.js`](../test/qr.spec.js) must stay green |
| a history field           | additive only; renaming `text`, `size`, `fgColor`, `bgColor` or `preset` erases what people had ([CONTRIBUTING.md](../CONTRIBUTING.md))                  |
| a feature the old app had | update [`paridade.json`](../paridade.json) in the same commit                                                                                            |
| a text                    | in the ten `i18n/*.json` with the same keys                                                                                                              |

Install with `yarn install --frozen-lockfile --ignore-scripts` after any dependency change and commit `package.json` and `yarn.lock` together.

## 4. Undoing

| Step                                 | How to undo                                                                                                                                                                      |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| a tag pushed on the wrong commit     | before anyone pins it: `git push origin :refs/tags/vX.Y.Z`, `git tag -d vX.Y.Z`, tag the right commit and push. After RoqueOS pinned it, do not move it: cut a new patch version |
| a release that breaks in RoqueOS     | RoqueOS goes back to the previous tag in its `package.json`; here, `git revert` on `main` and a new tag                                                                          |
| a merged change that breaks the gate | `git revert -s <commit>` in a pull request                                                                                                                                       |
| Clear history, for a person          | there is no undo in the app: the confirmation is the only guard ([`src/QRCode.vue`](../src/QRCode.vue))                                                                          |

## 5. Backup and restore

The repo is the source and lives on GitHub; a clone plus `yarn install --frozen-lockfile --ignore-scripts` restores everything. The people's history is not here: it lives in their accounts in RoqueOS (`users/{uid}/qrCodes`), and its backup is RoqueOS's. The development history is only the browser's `localStorage`, disposable by design.

## 6. What to monitor

| What                 | Healthy                                                                    | How to look                         |
| -------------------- | -------------------------------------------------------------------------- | ----------------------------------- |
| the gate             | `ok, o repo cumpre o contrato.` and 30 tests passing (measured 18/11/2026) | `yarn verificar`                    |
| CI on `main`         | `verificar` green                                                          | `gh run list --limit 3`             |
| pull requests        | `dco` green on each                                                        | `gh pr checks <number>`             |
| the pin in RoqueOS   | the newest tag here is the one RoqueOS pins                                | RoqueOS's `package.json`            |
| the parity inventory | 0 `perdida` without `decisao`                                              | [`paridade.json`](../paridade.json) |

The app sends `qr_generate` and `qr_download` to RoqueOS's metrics; where those are read is RoqueOS's, not this repo's.
