// O que o QR Code faz sem depender de tela: os modelos de cada tipo, a imagem do código, o
// histórico em ordem e os campos que uma entrada do histórico guarda.
//
// ⚠️ O CÓDIGO NASCE AQUI, NO APARELHO. Até sair do RoqueOS, o QR Code pedia a imagem para
// `api.qrserver.com`, com o texto na URL: o link, o e-mail e a senha do Wi-Fi passavam por um
// terceiro, e a URL com o texto ficava gravada no histórico. Agora quem desenha é o pacote
// `qrcode` (MIT), no navegador, e o histórico guarda só o texto e as escolhas de cor e tamanho.

import QRCode from 'qrcode'

/** Os tipos de conteúdo, na ordem da tela. O modelo de cada um vem dos textos do idioma. */
export const TIPOS = Object.freeze([
  Object.freeze({ id: 'url', icone: 'link', rotulo: 'tipoUrl', modelo: 'modeloUrl' }),
  Object.freeze({ id: 'email', icone: 'email', rotulo: 'tipoEmail', modelo: 'modeloEmail' }),
  Object.freeze({ id: 'phone', icone: 'phone', rotulo: 'tipoTelefone', modelo: 'modeloTelefone' }),
  Object.freeze({ id: 'wifi', icone: 'wifi', rotulo: 'tipoWifi', modelo: 'modeloWifi' }),
  Object.freeze({ id: 'sms', icone: 'sms', rotulo: 'tipoSms', modelo: 'modeloSms' }),
  Object.freeze({ id: 'text', icone: 'text_fields', rotulo: 'tipoTexto', modelo: null }),
])

/** Os lados da imagem em pixels, e o rótulo de cada um. */
export const TAMANHOS = Object.freeze([
  Object.freeze({ valor: 200, rotulo: 'tamanhoPequeno' }),
  Object.freeze({ valor: 300, rotulo: 'tamanhoMedio' }),
  Object.freeze({ valor: 500, rotulo: 'tamanhoGrande' }),
  Object.freeze({ valor: 800, rotulo: 'tamanhoHd' }),
])
export const TAMANHO_PADRAO = 300
export const FRENTE_PADRAO = '#000000'
export const FUNDO_PADRAO = '#ffffff'
/** Quantas entradas a tela mostra, das mais novas. */
export const LIMITE_DO_HISTORICO = 50

const HEX = /^#[0-9a-f]{6}$/i
/** Cor em `#rrggbb`; qualquer outra coisa vira a de reserva. */
export const cor = (valor, reserva) =>
  typeof valor === 'string' && HEX.test(valor) ? valor : reserva

/**
 * A cor do texto que fica legível sobre um fundo `#rrggbb`: escura no fundo claro, clara no
 * escuro (luminância relativa do WCAG, corte em 0,5).
 */
export function textoSobre(fundo) {
  const hex = cor(fundo, FUNDO_PADRAO).slice(1)
  const canal = (i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  const luz = 0.2126 * canal(0) + 0.7152 * canal(2) + 0.0722 * canal(4)
  return luz > 0.5 ? 'rgba(0, 0, 0, 0.55)' : 'rgba(255, 255, 255, 0.75)'
}

/** Tamanho da lista; qualquer outro vira o padrão. */
export const tamanho = (valor) =>
  TAMANHOS.some((t) => t.valor === Number(valor)) ? Number(valor) : TAMANHO_PADRAO

/**
 * A correção de erro, da mais forte que cabe para a mais fraca. A M aguenta um código riscado
 * ou meio apagado; a L é a que o serviço de antes usava sempre, e é a que faz caber o texto
 * longo (2.953 bytes contra 2.331 da M). Texto que cabia antes continua cabendo.
 */
export const CORRECOES = Object.freeze(['M', 'L'])

// O pacote avisa com "The amount of data is too big to be stored in a QR Code".
const naoCabe = (erro) => /too big/i.test(String(erro?.message))

/**
 * A imagem do código, como data URL PNG. Rejeita com `codigo: 'longo-demais'` quando o texto
 * não cabe num QR Code nem com a correção mais fraca.
 * @param {string} texto
 * @param {{ tamanho?: number, frente?: string, fundo?: string }} [opcoes]
 */
export async function gerarImagem(texto, opcoes = {}) {
  if (typeof texto !== 'string' || !texto.trim()) throw new TypeError('gerarImagem: texto vazio')
  const desenho = {
    width: tamanho(opcoes.tamanho),
    margin: 2,
    color: {
      dark: cor(opcoes.frente, FRENTE_PADRAO),
      light: cor(opcoes.fundo, FUNDO_PADRAO),
    },
  }
  for (const errorCorrectionLevel of CORRECOES) {
    try {
      return await QRCode.toDataURL(texto, { ...desenho, errorCorrectionLevel })
    } catch (erro) {
      if (!naoCabe(erro)) throw erro
    }
  }
  const longo = new Error('texto longo demais para um QR Code')
  longo.codigo = 'longo-demais'
  throw longo
}

/**
 * Os campos que uma entrada do histórico guarda. Os nomes são os de antes da saída do
 * RoqueOS (`text`, `size`, `fgColor`, `bgColor`, `preset`): o histórico de quem já usa
 * continua valendo. A data de criação é carimbo do sistema, e a URL da imagem não é mais
 * guardada.
 */
export function camposDoHistorico({ texto, tamanho: lado, frente, fundo, tipo }) {
  return {
    text: texto,
    size: tamanho(lado),
    fgColor: cor(frente, FRENTE_PADRAO),
    bgColor: cor(fundo, FUNDO_PADRAO),
    preset: TIPOS.some((t) => t.id === tipo) ? tipo : null,
  }
}

/** Uma entrada do histórico como a tela usa, venha ela de hoje ou de antes. */
export function lerEntrada(doc) {
  return {
    id: doc.id,
    texto: typeof doc.text === 'string' ? doc.text : '',
    tamanho: tamanho(doc.size),
    frente: cor(doc.fgColor, FRENTE_PADRAO),
    fundo: cor(doc.bgColor, FUNDO_PADRAO),
    tipo: TIPOS.some((t) => t.id === doc.preset) ? doc.preset : null,
    // `createdAtMs` é o carimbo que o app de antes gravava do relógio do aparelho.
    quando: Number(doc.criadoEm ?? doc.createdAtMs) || 0,
  }
}

/** O histórico da mais nova para a mais velha, até o limite, sem entrada vazia. */
export function ordenarHistorico(docs, limite = LIMITE_DO_HISTORICO) {
  return docs
    .map(lerEntrada)
    .filter((e) => e.texto)
    .sort((a, b) => b.quando - a.quando)
    .slice(0, limite)
}

/** O começo do texto, para a linha do histórico. */
export const resumo = (texto, max = 40) =>
  texto.length > max ? `${texto.slice(0, max - 1).trimEnd()}…` : texto

/**
 * O PNG da data URL, para copiar e compartilhar. **Síncrono de propósito**: o Safari do iPhone
 * só deixa escrever na área de transferência e abrir a folha de compartilhar dentro do toque da
 * pessoa, e um `await` antes da chamada (o `fetch` da data URL, como era) já sai do toque.
 */
export function pngDaImagem(dataUrl) {
  const [, base64 = ''] = String(dataUrl).split(',', 2)
  const binario = atob(base64)
  const bytes = new Uint8Array(binario.length)
  for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i)
  return new Blob([bytes], { type: 'image/png' })
}

/** Um id de documento que o SDK aceita (`[A-Za-z0-9_-]`), único o bastante para o histórico. */
export const novoId = (agora = Date.now(), sortear = Math.random) =>
  `qr_${agora}_${Math.floor(sortear() * 1e9).toString(36)}`
