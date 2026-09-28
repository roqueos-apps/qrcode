// O que o QR Code faz sem tela, e a trava de que o texto não sai do aparelho.
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import {
  FRENTE_PADRAO,
  FUNDO_PADRAO,
  LIMITE_DO_HISTORICO,
  TIPOS,
  camposDoHistorico,
  cor,
  gerarImagem,
  lerEntrada,
  novoId,
  ordenarHistorico,
  resumo,
  tamanho,
  textoSobre,
} from '../src/qr.js'

describe('o texto não sai do aparelho', () => {
  it('nenhum arquivo de src/ tem endereço remoto no código', () => {
    // O QR Code de antes pedia a imagem a `api.qrserver.com`, com o texto (às vezes a senha
    // do Wi-Fi) na URL. O comentário pode contar a história; o código não pode ter endereço.
    const pasta = join(process.cwd(), 'src')
    const comEndereco = readdirSync(pasta)
      .filter((f) => /\.(js|vue)$/.test(f))
      .filter((f) => {
        const semComentario = readFileSync(join(pasta, f), 'utf8')
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/<!--[\s\S]*?-->/g, '')
          .replace(/(^|[^:])\/\/.*$/gm, '$1')
        return /https?:\/\//.test(semComentario)
      })
    expect(comEndereco).toEqual([])
  })

  it('a imagem é um PNG desenhado aqui, nas cores e no tamanho pedidos', async () => {
    const url = await gerarImagem('senha do wifi', {
      tamanho: 200,
      frente: '#112233',
      fundo: '#fafafa',
    })
    expect(url).toMatch(/^data:image\/png;base64,/)
    const maior = await gerarImagem('senha do wifi', { tamanho: 800 })
    expect(maior.length).toBeGreaterThan(url.length)
  })

  it('texto que não cabe num QR Code rejeita com código próprio', async () => {
    await expect(gerarImagem('x'.repeat(8000))).rejects.toMatchObject({ codigo: 'longo-demais' })
    await expect(gerarImagem('   ')).rejects.toThrow(TypeError)
  })
})

describe('o histórico', () => {
  it('guarda só texto, tamanho, cores e tipo, com os nomes de antes', () => {
    expect(
      camposDoHistorico({
        texto: 'a',
        tamanho: 500,
        frente: '#abcdef',
        fundo: '#000000',
        tipo: 'wifi',
      }),
    ).toEqual({ text: 'a', size: 500, fgColor: '#abcdef', bgColor: '#000000', preset: 'wifi' })
    // Valor fora da lista cai no padrão, e não entra no banco como veio.
    expect(
      camposDoHistorico({ texto: 'a', tamanho: 12, frente: 'red', fundo: '#12', tipo: 'hack' }),
    ).toEqual({ text: 'a', size: 300, fgColor: FRENTE_PADRAO, bgColor: FUNDO_PADRAO, preset: null })
  })

  it('lê a entrada de antes, com a data do aparelho quando falta o carimbo', () => {
    expect(
      lerEntrada({
        id: 'x',
        text: 't',
        size: 800,
        fgColor: '#000000',
        bgColor: '#ffffff',
        createdAtMs: 42,
        url: 'https://terceiro',
      }),
    ).toEqual({
      id: 'x',
      texto: 't',
      tamanho: 800,
      frente: '#000000',
      fundo: '#ffffff',
      tipo: null,
      quando: 42,
    })
  })

  it('ordena da mais nova para a mais velha, tira as vazias e para no limite', () => {
    const docs = Array.from({ length: LIMITE_DO_HISTORICO + 5 }, (_, i) => ({
      id: `d${i}`,
      text: `t${i}`,
      criadoEm: i,
    }))
    docs.push({ id: 'vazia', text: '', criadoEm: 9_999 })
    const lista = ordenarHistorico(docs)
    expect(lista).toHaveLength(LIMITE_DO_HISTORICO)
    expect(lista[0].id).toBe(`d${LIMITE_DO_HISTORICO + 4}`)
    expect(lista.some((e) => e.id === 'vazia')).toBe(false)
  })
})

describe('os detalhes', () => {
  it('cor e tamanho só da lista, com a reserva', () => {
    expect(cor('#A1b2C3', '#000000')).toBe('#A1b2C3')
    expect(cor('url(javascript:1)', '#000000')).toBe('#000000')
    expect(tamanho('500')).toBe(500)
    expect(tamanho(501)).toBe(300)
  })

  it('o texto do vazio fica legível sobre o fundo escolhido', () => {
    expect(textoSobre('#ffffff')).toBe('rgba(0, 0, 0, 0.55)')
    expect(textoSobre('#000000')).toBe('rgba(255, 255, 255, 0.75)')
    expect(textoSobre('#8b5cf6')).toBe('rgba(255, 255, 255, 0.75)')
  })

  it('o id serve para o SDK, e dois gerados no mesmo milésimo não colidem', () => {
    expect(novoId(1, () => 0.5)).toMatch(/^[A-Za-z0-9_-]{1,128}$/)
    expect(novoId(1, () => 0.1)).not.toBe(novoId(1, () => 0.2))
  })

  it('o resumo corta com reticências', () => {
    expect(resumo('curto')).toBe('curto')
    expect(resumo('a'.repeat(60), 10)).toBe('aaaaaaaaa…')
  })

  it('cada tipo tem rótulo e ícone, e só o texto livre não tem modelo', () => {
    expect(TIPOS.map((t) => t.id)).toEqual(['url', 'email', 'phone', 'wifi', 'sms', 'text'])
    expect(TIPOS.filter((t) => !t.modelo).map((t) => t.id)).toEqual(['text'])
  })
})
