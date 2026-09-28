// O QR Code como o app-sdk entende um app: o `mount` que o RoqueOS chama, com o sistema falso
// do SDK. O que importa aqui é o que cada ação grava no histórico (e o que não grava: a URL de
// imagem de terceiro e os dados da conta que o app de antes guardava) e o que ela faz com a
// imagem, que nasce no aparelho.
import { describe, it, expect, afterEach, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { criarSistemaFalso } from '@roqueos-apps/app-sdk/sistema-falso'
import { validarManifesto, verificarSistema } from '@roqueos-apps/app-sdk'
import qrcode, { CAPACIDADES } from '../src/index.js'
import manifesto from '../app.json'

const ANA = { uid: 'ana', nome: 'Ana' }

/** Uma entrada como o QR Code de antes gravava: com a URL do terceiro e os dados da conta. */
const antiga = (id, extra = {}) => ({
  id,
  text: `https://exemplo.com/${id}`,
  url: `https://api.qrserver.com/v1/create-qr-code/?data=${id}`,
  size: 300,
  fgColor: '#000000',
  bgColor: '#ffffff',
  preset: 'url',
  createdAtMs: 1_000,
  createdBy: { uid: 'ana', email: 'ana@exemplo.com' },
  criadoEm: 1_000,
  ...extra,
})

function montar({ identidade = ANA, semear = [], idioma = 'pt-BR' } = {}) {
  const falso = criarSistemaFalso({ appId: 'qrcode', identidade, colecoes: ['historico'], idioma })
  if (semear.length) falso.colecoes.semear('historico', 'ana', semear)
  const gravacoes = []
  const abrir = falso.sistema.colecoes.abrir
  falso.sistema.colecoes = {
    abrir(nome) {
      const c = abrir(nome)
      return {
        observar: c.observar,
        criar: (id, campos) => (gravacoes.push(['criar', id, campos]), c.criar(id, campos)),
        atualizar: (id, campos) => (
          gravacoes.push(['atualizar', id, campos]), c.atualizar(id, campos)
        ),
        apagar: (id) => (gravacoes.push(['apagar', id]), c.apagar(id)),
      }
    },
  }
  const el = document.createElement('div')
  document.body.appendChild(el)
  const montagem = qrcode.mount(el, falso.sistema, { windowId: 'w1', ativo: true })
  const q = (s) => el.querySelector(s)
  const teste = (nome) => el.querySelector(`[data-teste="${nome}"]`)
  const guardado = () => falso.colecoes.guardado('historico', 'ana')
  return { ...falso, el, montagem, q, teste, gravacoes, guardado }
}

const montou = (el) => vi.waitFor(() => expect(el.querySelector('.qr')).not.toBeNull())
const digitar = async (campo, valor) => {
  campo.value = valor
  campo.dispatchEvent(new Event('input'))
  await flushPromises()
}
const gerou = (el) =>
  vi.waitFor(() =>
    expect(el.querySelector('[data-teste="imagem"]')?.getAttribute('src')).toMatch(
      /^data:image\/png;base64,/,
    ),
  )

describe('o QR Code pelo app-sdk', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('o id e as capacidades são os do manifesto, e o manifesto é válido', () => {
    expect(qrcode.id).toBe('qrcode')
    expect(manifesto.id).toBe(qrcode.id)
    expect(validarManifesto(manifesto)).toEqual([])
    // O index.js não pode importar o app.json (o build do RoqueOS quebra): as duas listas são
    // escritas duas vezes, e é este teste que não deixa uma andar sem a outra.
    expect([...qrcode.capacidades].sort()).toEqual([...manifesto.capacidades].sort())
    expect(CAPACIDADES).toEqual(qrcode.capacidades)
    expect(manifesto.colecoes).toEqual(['historico'])
  })

  it('não monta num sistema sem a coleção, e diz o que falta', () => {
    const { sistema } = criarSistemaFalso()
    const semColecoes = { ...sistema }
    delete semColecoes.colecoes
    expect(verificarSistema(semColecoes, { exigidas: qrcode.capacidades }).problemas).toEqual([
      'falta a capacidade "colecoes"',
    ])
    expect(() => qrcode.mount(document.createElement('div'), semColecoes)).toThrow(/colecoes/)
  })

  it('gera no aparelho e guarda no histórico só o texto, as cores, o tamanho e o tipo', async () => {
    const { el, montagem, teste, gravacoes, registro } = montar()
    await montou(el)
    await digitar(teste('texto'), 'https://roqueos.com.br')
    teste('gerar').click()
    await gerou(el)
    await flushPromises()
    expect(gravacoes).toHaveLength(1)
    const [acao, id, campos] = gravacoes[0]
    expect(acao).toBe('criar')
    expect(id).toMatch(/^qr_\d+_[a-z0-9]+$/)
    expect(campos).toEqual({
      text: 'https://roqueos.com.br',
      size: 300,
      fgColor: '#000000',
      bgColor: '#ffffff',
      preset: null,
    })
    expect(registro.eventos).toEqual([{ nome: 'qr_generate', dados: {} }])
    montagem.desmontar()
  })

  it('sem conta, o código aparece do mesmo jeito e só o histórico fica de fora', async () => {
    const { el, montagem, teste, gravacoes, registro } = montar({
      identidade: { uid: null, nome: null },
    })
    await montou(el)
    await digitar(teste('texto'), 'olá')
    teste('gerar').click()
    await gerou(el)
    expect(gravacoes).toEqual([])
    expect(registro.avisos).toEqual([
      { mensagem: 'Entre na sua conta para guardar no histórico.', tipo: 'aviso', fixo: false },
    ])
    montagem.desmontar()
  })

  it('o histórico de antes aparece, da mais nova para a mais velha, sem usar a URL do terceiro', async () => {
    const { el, montagem } = montar({
      semear: [antiga('a', { criadoEm: 1_000 }), antiga('b', { criadoEm: 3_000 })],
    })
    await montou(el)
    el.querySelector('[data-teste="abrir-historico"]').click()
    const textos = () =>
      [...el.querySelectorAll('.qr__entrada-texto')].map((e) => e.textContent.trim())
    await vi.waitFor(() =>
      expect(textos()).toEqual(['https://exemplo.com/b', 'https://exemplo.com/a']),
    )
    // As miniaturas nascem no aparelho; o `src` nunca é o `url` que o app de antes guardou.
    await vi.waitFor(() =>
      expect([...el.querySelectorAll('img.qr__miniatura')].map((i) => i.src.slice(0, 22))).toEqual([
        'data:image/png;base64,',
        'data:image/png;base64,',
      ]),
    )
    expect(el.innerHTML).not.toContain('qrserver')
    montagem.desmontar()
  })

  it('o histórico que ainda não chegou mostra a barra do carregando, parada no perfil leve', async () => {
    // O QR Code de antes tinha o spinner ao lado do "Carregando...".
    for (const modoLeve of [false, true]) {
      const falso = criarSistemaFalso({
        appId: 'qrcode',
        identidade: ANA,
        colecoes: ['historico'],
        modoLeve,
      })
      const abrir = falso.sistema.colecoes.abrir
      // A conta ainda não respondeu: a lista nunca chega.
      falso.sistema.colecoes.abrir = (nome) => ({ ...abrir(nome), observar: () => () => {} })
      const el = document.createElement('div')
      document.body.appendChild(el)
      const montagem = qrcode.mount(el, falso.sistema, { windowId: 'w1', ativo: true })
      await montou(el)
      el.querySelector('[data-teste="abrir-historico"]').click()
      await vi.waitFor(() => expect(el.querySelector('.rui-vazio__barra')).not.toBeNull())
      expect(el.querySelector('.rui-vazio').textContent).toContain('Carregando...')
      expect(Boolean(el.querySelector('.rui-vazio__barra--parada'))).toBe(modoLeve)
      montagem.desmontar()
    }
  })

  it('abrir uma entrada do histórico desenha o código sem criar outra entrada', async () => {
    const { el, montagem, teste, gravacoes } = montar({
      semear: [antiga('a', { fgColor: '#112233', bgColor: '#fafafa', size: 500 })],
    })
    await montou(el)
    teste('abrir-historico').click()
    await vi.waitFor(() => expect(teste('entrada-a')).not.toBeNull())
    teste('entrada-a').click()
    await gerou(el)
    expect(teste('texto').value).toBe('https://exemplo.com/a')
    expect(teste('frente').value).toBe('#112233')
    expect(teste('tamanho').value).toBe('500')
    expect(gravacoes).toEqual([])
    montagem.desmontar()
  })

  it('o tipo põe o modelo no campo, no idioma da pessoa', async () => {
    const { el, montagem, teste } = montar()
    await montou(el)
    teste('tipo-wifi').click()
    await flushPromises()
    expect(teste('texto').value).toBe('WIFI:T:WPA;S:NomeDaRede;P:SenhaDoWiFi;;')
    expect(teste('tipo-wifi').getAttribute('aria-pressed')).toBe('true')
    montagem.desmontar()

    const ingles = montar({ idioma: 'en-US' })
    await montou(ingles.el)
    ingles.teste('tipo-wifi').click()
    await flushPromises()
    expect(ingles.teste('texto').value).toBe('WIFI:T:WPA;S:NetworkName;P:WiFiPassword;;')
    ingles.montagem.desmontar()
  })

  it('mudar a cor apaga a imagem de antes, até gerar de novo', async () => {
    const { el, montagem, teste } = montar()
    await montou(el)
    await digitar(teste('texto'), 'abc')
    teste('gerar').click()
    await gerou(el)
    const frente = teste('frente')
    frente.value = '#ff0000'
    frente.dispatchEvent(new Event('input'))
    await flushPromises()
    expect(teste('imagem')).toBeNull()
    montagem.desmontar()
  })

  it('texto longo demais avisa e não guarda nada', async () => {
    const { el, montagem, teste, gravacoes, registro } = montar()
    await montou(el)
    await digitar(teste('texto'), 'x'.repeat(8000))
    teste('gerar').click()
    await vi.waitFor(() =>
      expect(registro.avisos.at(-1)).toEqual({
        mensagem: 'O texto é longo demais para caber num QR Code.',
        tipo: 'erro',
        fixo: false,
      }),
    )
    expect(teste('imagem')).toBeNull()
    expect(gravacoes).toEqual([])
    montagem.desmontar()
  })

  it('limpar o histórico pede confirmação e apaga entrada por entrada', async () => {
    const { el, montagem, teste, gravacoes, guardado } = montar({
      semear: [antiga('a'), antiga('b')],
    })
    await montou(el)
    teste('abrir-historico').click()
    await vi.waitFor(() => expect(teste('limpar')).not.toBeNull())
    expect(teste('limpar').getAttribute('aria-disabled')).toBe('false')
    teste('limpar').click()
    await flushPromises()
    expect(gravacoes).toEqual([])
    const confirmar = [...document.querySelectorAll('button')].find(
      (b) => b.textContent.trim() === 'Limpar' && b !== teste('limpar'),
    )
    confirmar.click()
    await vi.waitFor(() => expect(guardado()).toEqual([]))
    expect(gravacoes.map(([acao, id]) => [acao, id]).sort()).toEqual([
      ['apagar', 'a'],
      ['apagar', 'b'],
    ])
    // Vazio, o botão fica focável (aria-disabled) e não abre a confirmação de novo.
    await vi.waitFor(() => expect(teste('limpar').getAttribute('aria-disabled')).toBe('true'))
    expect(teste('limpar').disabled).toBe(false)
    teste('limpar').click()
    await flushPromises()
    expect(document.querySelector('[role="alertdialog"]')).toBeNull()
    montagem.desmontar()
  })

  it('baixar cria o link dentro do app, com o PNG do aparelho, e conta a métrica', async () => {
    const { el, montagem, teste, registro } = montar()
    await montou(el)
    await digitar(teste('texto'), 'abc')
    teste('gerar').click()
    await gerou(el)
    let clicado = null
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () {
      clicado = { href: this.href, download: this.download, dentro: el.contains(this) }
    })
    ;[...el.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Baixar').click()
    expect(clicado.href).toMatch(/^data:image\/png;base64,/)
    expect(clicado.download).toMatch(/^qrcode-\d+\.png$/)
    expect(clicado.dentro).toBe(true)
    expect(el.querySelector('a')).toBeNull()
    expect(registro.eventos.map((e) => e.nome)).toContain('qr_download')
    montagem.desmontar()
  })

  it('copiar manda a imagem; sem cópia de imagem no navegador, manda o texto', async () => {
    const { el, montagem, teste, registro } = montar()
    await montou(el)
    await digitar(teste('texto'), 'abc')
    teste('gerar').click()
    await gerou(el)
    const escritos = []
    class ClipboardItem {
      constructor(itens) {
        this.tipos = Object.keys(itens)
      }
    }
    vi.stubGlobal('ClipboardItem', ClipboardItem)
    vi.stubGlobal('navigator', {
      ...navigator,
      clipboard: { write: async (itens) => escritos.push(itens[0].tipos) },
    })
    const copiar = () =>
      [...el.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Copiar').click()
    copiar()
    // Dentro do toque, sem esperar nada: o Safari do iPhone recusa a escrita depois de um await.
    expect(escritos).toEqual([['image/png']])
    await vi.waitFor(() => expect(registro.avisos.at(-1).mensagem).toBe('Imagem copiada!'))

    const textos = []
    vi.stubGlobal('ClipboardItem', undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText: async (t) => textos.push(t) } })
    copiar()
    await vi.waitFor(() => expect(textos).toEqual(['abc']))
    expect(registro.avisos.at(-1).mensagem).toBe('Texto do QR Code copiado!')
    vi.unstubAllGlobals()
    montagem.desmontar()
  })

  it('copiar a imagem recusada ainda copia o texto do código', async () => {
    const { el, montagem, teste, registro } = montar()
    await montou(el)
    await digitar(teste('texto'), 'abc')
    teste('gerar').click()
    await gerou(el)
    vi.stubGlobal(
      'ClipboardItem',
      class {
        constructor(itens) {
          this.itens = itens
        }
      },
    )
    const textos = []
    vi.stubGlobal('navigator', {
      clipboard: {
        write: async () => {
          throw new DOMException('recusado', 'NotAllowedError')
        },
        writeText: async (t) => textos.push(t),
      },
    })
    vi.spyOn(console, 'error').mockImplementation(() => {})
    ;[...el.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Copiar').click()
    await vi.waitFor(() => expect(textos).toEqual(['abc']))
    expect(registro.avisos.at(-1)).toEqual({
      mensagem: 'Texto do QR Code copiado!',
      tipo: 'sucesso',
      fixo: false,
    })
    vi.unstubAllGlobals()
    montagem.desmontar()
  })

  it('compartilhar manda o PNG com o texto; sem arquivo, o texto; sem folha nenhuma, copia', async () => {
    const { el, montagem, teste } = montar()
    await montou(el)
    await digitar(teste('texto'), 'abc')
    teste('gerar').click()
    await gerou(el)
    const compartilhados = []
    const anotar = async ({ files, ...resto }) =>
      compartilhados.push({ ...resto, ...(files && { files: files.map((f) => [f.name, f.type]) }) })
    vi.stubGlobal('navigator', { canShare: () => true, share: anotar })
    const compartilhar = () =>
      [...el.querySelectorAll('button')]
        .find((b) => b.textContent.trim() === 'Compartilhar')
        .click()
    compartilhar()
    // Dentro do toque, sem esperar nada: o Safari do iPhone não abre a folha depois de um await.
    expect(compartilhados).toEqual([
      { title: 'QR Code', text: 'abc', files: [['qrcode.png', 'image/png']] },
    ])

    // O aparelho compartilha texto, mas não arquivo: a folha abre com o texto, como antes.
    vi.stubGlobal('navigator', { canShare: () => false, share: anotar })
    compartilhar()
    expect(compartilhados.at(-1)).toEqual({ title: 'QR Code', text: 'abc' })

    const textos = []
    vi.stubGlobal('navigator', { clipboard: { writeText: async (t) => textos.push(t) } })
    compartilhar()
    await vi.waitFor(() => expect(textos).toEqual(['abc']))
    expect(compartilhados).toHaveLength(2)
    vi.unstubAllGlobals()
    montagem.desmontar()
  })

  it('cancelar a folha de compartilhar não copia nada', async () => {
    const { el, montagem, teste, registro } = montar()
    await montou(el)
    await digitar(teste('texto'), 'abc')
    teste('gerar').click()
    await gerou(el)
    const antes = registro.avisos.length
    const textos = []
    vi.stubGlobal('navigator', {
      canShare: () => true,
      share: async () => {
        throw new DOMException('cancelou', 'AbortError')
      },
      clipboard: { writeText: async (t) => textos.push(t) },
    })
    ;[...el.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Compartilhar').click()
    await flushPromises()
    expect(textos).toEqual([])
    expect(registro.avisos).toHaveLength(antes)
    vi.unstubAllGlobals()
    montagem.desmontar()
  })
})
