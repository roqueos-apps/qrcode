# QR Code documentation

_English | [Português](pt-BR/INDEX.md)_

The QR Code app of RoqueOS: it draws the code on the device, keeps the history in the person's account through the `app-sdk`, and runs the same inside RoqueOS, alone in the browser and in the tests. For whoever changes the app, reviews a pull request, or wires it into RoqueOS.

Where to start depends on what you want.

| I want...                                       | Read                                                                                    |
| ----------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Install and see the code on screen**          | [GETTING-STARTED.md](GETTING-STARTED.md): from zero to the first result                 |
| **See how it is built inside**                  | [ARCHITECTURE.md](ARCHITECTURE.md): context, components, flows, data, decisions, limits |
| **Look up a command, file, field or text key**  | [REFERENCE.md](REFERENCE.md)                                                            |
| **Maintain it and cut a release**               | [OPERATIONS.md](OPERATIONS.md): routine, publishing, updating, undoing                  |
| **Understand a failure**                        | [WHEN-IT-BREAKS.md](WHEN-IT-BREAKS.md): symptom, cause, what to do                      |
| **Add a type, a size or a text**                | [EXTENDING.md](EXTENDING.md)                                                            |
| **Know how RoqueOS mounts it and what it gets** | [INTEGRATIONS.md](INTEGRATIONS.md)                                                      |
| **Know what it protects and what it does not**  | [THREAT-MODEL.md](THREAT-MODEL.md)                                                      |
| **Know what the tests prove**                   | [TESTING.md](TESTING.md)                                                                |
| **Find a term**                                 | [GLOSSARY.md](GLOSSARY.md)                                                              |
| **Contribute**                                  | [CONTRIBUTING.md](../CONTRIBUTING.md)                                                   |
| **See what changed**                            | [CHANGELOG.md](../CHANGELOG.md) (in Portuguese)                                         |
| **Report a vulnerability**                      | [SECURITY.md](../SECURITY.md)                                                           |
| **Start from the front page**                   | [README.md](../README.md)                                                               |

## Diagrams

| Diagram                                  | Source                                        | Explained in                                                             |
| ---------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------ |
| The cover (screenshot, not a diagram)    | [`capa.jpg`](capa.jpg), origin in `ASSETS.md` | [README.md](../README.md)                                                |
| The parts and RoqueOS                    | Mermaid in the Markdown                       | [README.md](../README.md#the-parts)                                      |
| Context: who uses it, what it depends on | Mermaid in the Markdown                       | [ARCHITECTURE.md, section 2](ARCHITECTURE.md#2-context)                  |
| Mounting the app                         | Mermaid in the Markdown                       | [ARCHITECTURE.md, section 5.1](ARCHITECTURE.md#51-mounting)              |
| Generating and saving a code             | Mermaid in the Markdown                       | [ARCHITECTURE.md, section 5.2](ARCHITECTURE.md#52-generating-and-saving) |
| Copying and sharing                      | Mermaid in the Markdown                       | [ARCHITECTURE.md, section 5.3](ARCHITECTURE.md#53-copying-and-sharing)   |

The programs and the code are in Portuguese; messages, commands and keys are quoted as they appear.
