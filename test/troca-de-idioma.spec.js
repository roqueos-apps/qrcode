// A troca de idioma: com a janela aberta e fora de ordem.
//
// O `import()` do JSON de cada idioma volta na ordem que a rede quiser. Se o montar aceitasse
// a resposta que chegou por último, e não a do último pedido, a pessoa que trocou de árabe
// para alemão ficaria com a tela em árabe. O teste controla a ordem das respostas.
import { describe, it, expect, vi } from 'vitest'
import { criarSistemaFalso } from '@roqueos-apps/app-sdk/sistema-falso'

const h = vi.hoisted(() => ({ pendentes: new Map() }))

vi.mock('../src/textos.js', async (original) => {
  const real = await original()
  return {
    ...real,
    carregarTextos: (idioma) =>
      new Promise((resolver) => h.pendentes.set(idioma, () => resolver({ gerar: idioma }))),
  }
})

import qrcode from '../src/index.js'

const rotulo = (el) => el.querySelector('[data-teste="gerar"]')?.textContent.trim()

describe('o QR Code troca de idioma fora de ordem', () => {
  it('vale o último idioma pedido, mesmo que a resposta dele chegue antes', async () => {
    const falso = criarSistemaFalso({ appId: 'qrcode', colecoes: ['historico'], idioma: 'pt-BR' })
    const el = document.createElement('div')
    const montagem = qrcode.mount(el, falso.sistema, { ativo: true })
    h.pendentes.get('pt-BR')()
    await vi.waitFor(() => expect(rotulo(el)).toBe('pt-BR'))

    falso.mudarIdioma('ar-AR')
    falso.mudarIdioma('de-DE')
    h.pendentes.get('de-DE')()
    await vi.waitFor(() => expect(rotulo(el)).toBe('de-DE'))
    h.pendentes.get('ar-AR')()
    await new Promise((r) => setTimeout(r, 20))
    expect(rotulo(el)).toBe('de-DE')
    montagem.desmontar()
  })
})
