// O QR Code rodando sozinho, numa janela falsa do RoqueOS com o sistema de desenvolvimento do
// SDK: o tamanho vem do app.json, o seletor troca entre os dez idiomas (o árabe vira da
// direita para a esquerda), e o histórico fica no localStorage, numa conta local. Na URL:
// `?idioma=ja-JP`, `?leve=1` (aparelho fraco) e `?convidado=1` (sem conta). É o mesmo `mount`
// que o RoqueOS chama.
import { montarNaJanelaFalsa } from '@roqueos-apps/app-sdk/sistema-de-desenvolvimento'
import manifesto from '../app.json'
import app from '../src/index.js'

montarNaJanelaFalsa(app, { manifesto })
