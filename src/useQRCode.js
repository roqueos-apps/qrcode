// O motor do QR Code: o formulário, a imagem, o histórico na conta e as ações da imagem
// (baixar, copiar, compartilhar). A tela (QRCode.vue) só desenha e chama; o que fala com o
// RoqueOS passa por aqui, e só pelo `sistema`.
//
// O histórico é a coleção `historico`, que o RoqueOS guarda em `users/{uid}/qrCodes`, o mesmo
// lugar de antes. Cada código gerado com conta vira uma entrada; sem conta o código aparece do
// mesmo jeito (ele nasce no aparelho) e só o histórico fica de fora.

import { computed, ref } from 'vue'
import {
  FRENTE_PADRAO,
  FUNDO_PADRAO,
  TAMANHO_PADRAO,
  TIPOS,
  camposDoHistorico,
  gerarImagem,
  novoId,
  ordenarHistorico,
  pngDaImagem,
} from './qr.js'

export const COLECAO = 'historico'
export const ACENTO = '#8b5cf6'

/**
 * @param {{ sistema: object, t: (chave: string) => string }} opcoes
 */
export function criarQRCode({ sistema, t }) {
  const colecao = sistema.colecoes.abrir(COLECAO)

  const texto = ref('')
  const tipo = ref(null)
  const tamanho = ref(TAMANHO_PADRAO)
  const frente = ref(FRENTE_PADRAO)
  const fundo = ref(FUNDO_PADRAO)
  const imagem = ref('')
  const gerando = ref(false)
  const docs = ref([])
  const carregandoHistorico = ref(true)
  const limpando = ref(false)

  const historico = computed(() => ordenarHistorico(docs.value))
  const podeGerar = computed(() => !gerando.value && Boolean(texto.value.trim()))

  const avisar = (mensagem, tipoDoAviso = 'sucesso') =>
    sistema.avisar(mensagem, { tipo: tipoDoAviso })
  const semConta = () => !sistema.identidade.atual().uid
  const metrica = (evento) => {
    try {
      sistema.metricas.evento(evento)
    } catch {
      // Métrica nunca derruba a ação.
    }
  }

  const pararColecao = colecao.observar(
    (lista) => {
      docs.value = lista
      carregandoHistorico.value = false
    },
    (erro) => {
      carregandoHistorico.value = false
      console.error('[qrcode] histórico:', erro)
    },
  )

  /** Mudou o texto, a cor ou o tamanho: a imagem de antes deixa de valer. */
  function sujou() {
    imagem.value = ''
  }

  function escolherTipo(id) {
    const escolhido = TIPOS.find((x) => x.id === id)
    if (!escolhido) return
    tipo.value = id
    texto.value = escolhido.modelo ? t(escolhido.modelo) : ''
    sujou()
  }

  const pedidoAtual = () => ({
    texto: texto.value,
    tamanho: tamanho.value,
    frente: frente.value,
    fundo: fundo.value,
    tipo: tipo.value,
  })

  /** Desenha o código na tela, sem guardar. Devolve se deu certo. */
  async function desenhar(pedido) {
    gerando.value = true
    try {
      imagem.value = await gerarImagem(pedido.texto, pedido)
      return true
    } catch (erro) {
      imagem.value = ''
      if (erro?.codigo === 'longo-demais') avisar(t('longoDemais'), 'erro')
      else {
        console.error('[qrcode] gerar:', erro)
        avisar(t('falhouGerar'), 'erro')
      }
      return false
    } finally {
      gerando.value = false
    }
  }

  /** Gera o código do formulário e, com conta, guarda no histórico. */
  async function gerar() {
    if (!podeGerar.value) return
    const pedido = pedidoAtual()
    if (!(await desenhar(pedido))) return
    metrica('qr_generate')
    // Sem conta o código está na tela e pronto; só não entra no histórico.
    if (semConta()) {
      avisar(t('entreParaGuardar'), 'aviso')
      return
    }
    try {
      await colecao.criar(novoId(), camposDoHistorico(pedido))
    } catch (erro) {
      if (erro?.codigo === 'sem-conta') avisar(t('entreParaGuardar'), 'aviso')
      else {
        console.error('[qrcode] histórico recusado:', erro)
        avisar(t('erroAoGuardar'), 'erro')
      }
    }
  }

  /** Volta uma entrada do histórico para o formulário e a tela, sem criar outra entrada. */
  function abrirDoHistorico(entrada) {
    texto.value = entrada.texto
    tamanho.value = entrada.tamanho
    frente.value = entrada.frente
    fundo.value = entrada.fundo
    tipo.value = entrada.tipo
    return desenhar(pedidoAtual())
  }

  async function limparHistorico() {
    if (limpando.value) return false
    limpando.value = true
    try {
      // Um documento por vez, na ordem: a capacidade apaga um id por chamada, e o histórico de
      // antes podia passar de mil entradas.
      for (const doc of [...docs.value]) await colecao.apagar(doc.id)
      return true
    } catch (erro) {
      console.error('[qrcode] limpar histórico:', erro)
      avisar(t('erroAoLimpar'), 'erro')
      return false
    } finally {
      limpando.value = false
    }
  }

  /** Baixa a imagem. O link nasce e morre dentro do elemento do app, fora do documento. */
  function baixar(onde) {
    if (!imagem.value) return
    try {
      const link = onde.ownerDocument.createElement('a')
      link.href = imagem.value
      link.download = `qrcode-${Date.now()}.png`
      link.style.display = 'none'
      onde.appendChild(link)
      link.click()
      link.remove()
      metrica('qr_download')
      avisar(t('baixado'))
    } catch (erro) {
      console.error('[qrcode] baixar:', erro)
      avisar(t('erroAoBaixar'), 'erro')
    }
  }

  /** Copia a imagem; onde o navegador não copia imagem, copia o texto do código. */
  async function copiar() {
    if (!imagem.value) return
    const area = globalThis.navigator?.clipboard
    try {
      if (area?.write && typeof globalThis.ClipboardItem === 'function') {
        const png = await pngDaImagem(imagem.value)
        await area.write([new globalThis.ClipboardItem({ 'image/png': png })])
        avisar(t('imagemCopiada'))
      } else if (area?.writeText) {
        await area.writeText(texto.value)
        avisar(t('textoCopiado'))
      } else {
        throw new Error('sem área de transferência')
      }
    } catch (erro) {
      console.error('[qrcode] copiar:', erro)
      avisar(t('erroAoCopiar'), 'erro')
    }
  }

  /** Compartilha a imagem; sem compartilhamento de arquivo no aparelho, copia. */
  async function compartilhar() {
    if (!imagem.value) return
    const nav = globalThis.navigator
    try {
      const png = await pngDaImagem(imagem.value)
      const arquivo = new File([png], 'qrcode.png', { type: 'image/png' })
      if (nav?.canShare?.({ files: [arquivo] })) {
        await nav.share({ files: [arquivo], title: t('nomeDoApp') })
        return
      }
    } catch (erro) {
      // Quem cancela a folha de compartilhar recebe AbortError: não é falha.
      if (erro?.name === 'AbortError') return
      console.error('[qrcode] compartilhar:', erro)
    }
    await copiar()
  }

  function encerrar() {
    pararColecao?.()
  }

  return {
    texto,
    tipo,
    tamanho,
    frente,
    fundo,
    imagem,
    gerando,
    historico,
    carregandoHistorico,
    limpando,
    podeGerar,
    sujou,
    escolherTipo,
    gerar,
    abrirDoHistorico,
    limparHistorico,
    baixar,
    copiar,
    compartilhar,
    encerrar,
  }
}
