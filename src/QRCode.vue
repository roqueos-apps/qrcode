<template>
  <div ref="raiz" class="qr" :class="{ 'qr--leve': estado.leve }" :style="estiloDoAcento">
    <div class="qr__principal">
      <!-- A imagem -->
      <section class="qr__previa" :aria-label="t('previa')">
        <div class="qr__cartao" :style="{ background: q.fundo.value }">
          <img
            v-if="q.imagem.value"
            :src="q.imagem.value"
            :alt="t('imagemDoCodigo')"
            class="qr__imagem"
            data-teste="imagem"
          />
          <div v-else class="qr__vazio" :style="{ color: textoSobre(q.fundo.value) }">
            <RosIcone nome="qr_code_2" :tamanho="80" />
            <p>{{ t('digiteParaGerar') }}</p>
          </div>
        </div>
        <div v-if="q.imagem.value" class="qr__acoes">
          <RosBotao icone="download" :rotulo="t('baixar')" @click="q.baixar(raiz)">{{
            t('baixar')
          }}</RosBotao>
          <RosBotao icone="content_copy" :rotulo="t('copiar')" @click="q.copiar()">{{
            t('copiar')
          }}</RosBotao>
          <RosBotao icone="share" :rotulo="t('compartilhar')" @click="q.compartilhar()">{{
            t('compartilhar')
          }}</RosBotao>
        </div>
      </section>

      <!-- O formulário -->
      <section class="qr__controles">
        <div class="qr__topo">
          <RosBotao
            icone="history"
            :rotulo="t('historico')"
            data-teste="abrir-historico"
            @click="historicoAberto = true"
          >
            {{ t('historico') }}
            <span v-if="q.historico.value.length" class="qr__contador">{{
              q.historico.value.length
            }}</span>
          </RosBotao>
        </div>

        <label class="qr__campo">
          <span class="qr__rotulo">{{ t('conteudo') }}</span>
          <textarea
            v-model="q.texto.value"
            class="qr__texto"
            :placeholder="t('placeholder')"
            data-teste="texto"
            @input="q.sujou()"
          ></textarea>
        </label>
        <RosBotao
          variante="primario"
          icone="qr_code_2"
          :acento="ACENTO"
          :disabled="!q.podeGerar.value"
          data-teste="gerar"
          @click="q.gerar()"
          >{{ t('gerar') }}</RosBotao
        >

        <div class="qr__grupo">
          <span class="qr__rotulo">{{ t('tipo') }}</span>
          <div class="qr__tipos" role="group" :aria-label="t('tipo')">
            <button
              v-for="tipo in TIPOS"
              :key="tipo.id"
              type="button"
              class="qr__tipo"
              :class="{ ativo: q.tipo.value === tipo.id }"
              :aria-pressed="String(q.tipo.value === tipo.id)"
              :data-teste="`tipo-${tipo.id}`"
              @click="q.escolherTipo(tipo.id)"
            >
              <RosIcone :nome="tipo.icone" :tamanho="18" />
              <span>{{ t(tipo.rotulo) }}</span>
            </button>
          </div>
        </div>

        <div class="qr__grupo">
          <span class="qr__rotulo">{{ t('personalizar') }}</span>
          <div class="qr__personalizar">
            <label class="qr__cor">
              <span>{{ t('corDoCodigo') }}</span>
              <input v-model="q.frente.value" type="color" data-teste="frente" @input="q.sujou()" />
            </label>
            <label class="qr__cor">
              <span>{{ t('fundo') }}</span>
              <input v-model="q.fundo.value" type="color" data-teste="fundo" @input="q.sujou()" />
            </label>
            <label class="qr__tamanho">
              <span>{{ t('tamanho') }}</span>
              <select v-model.number="q.tamanho.value" data-teste="tamanho" @change="q.sujou()">
                <option v-for="l in TAMANHOS" :key="l.valor" :value="l.valor">
                  {{ t(l.rotulo) }}
                </option>
              </select>
            </label>
          </div>
        </div>
      </section>
    </div>

    <RosFolha
      v-model="historicoAberto"
      :titulo="t('historico')"
      icone="history"
      :acento="ACENTO"
      :rotulo-fechar="t('fechar')"
    >
      <RosVazio
        v-if="q.carregandoHistorico.value"
        icone="history"
        :titulo="t('carregando')"
        :acento="ACENTO"
        carregando
        :leve="estado.leve"
      />
      <RosVazio
        v-else-if="!q.historico.value.length"
        icone="history"
        :titulo="t('historicoVazio')"
        :acento="ACENTO"
      />
      <ul v-else class="qr__historico">
        <li v-for="e in q.historico.value" :key="e.id">
          <button
            type="button"
            class="qr__entrada"
            :data-teste="`entrada-${e.id}`"
            @click="abrirEntrada(e)"
          >
            <img
              v-if="miniaturas[e.id]"
              :src="miniaturas[e.id]"
              alt=""
              class="qr__miniatura"
              :style="{ background: e.fundo }"
            />
            <span v-else class="qr__miniatura" :style="{ background: e.fundo }"></span>
            <span class="qr__entrada-texto">{{ resumo(e.texto) }}</span>
          </button>
        </li>
      </ul>
      <div class="qr__historico-pe">
        <!-- `aria-disabled`, e não `disabled`: o botão continua focável quando o histórico
             esvazia. Um botão com foco que vira `disabled` joga o foco no `body` (Chromium), e
             dali o Esc não fecha mais a folha (QA do yarn dev, 28/09/2026). -->
        <RosBotao
          variante="perigo"
          icone="delete_sweep"
          :aria-disabled="String(!podeLimpar)"
          data-teste="limpar"
          @click="podeLimpar && (confirmarLimpeza = true)"
          >{{ t('limpar') }}</RosBotao
        >
      </div>
    </RosFolha>

    <RosConfirmar
      v-model="confirmarLimpeza"
      :titulo="t('limparTitulo')"
      :texto="t('limparTexto')"
      icone="delete_sweep"
      perigo
      :rotulo-confirmar="t('limpar')"
      :rotulo-cancelar="t('cancelar')"
      @confirmar="q.limparHistorico()"
    />
  </div>
</template>

<script setup>
// A tela do QR Code. O motor (useQRCode.js) gera, guarda e fala com o sistema; aqui só se
// desenha e se chama. As miniaturas do histórico nascem aqui, no aparelho, a partir do texto
// e das cores de cada entrada: o histórico não guarda imagem nem URL.
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { RosBotao, RosConfirmar, RosFolha, RosIcone, RosVazio } from '@roqueos-apps/ui'
import { ACENTO, criarQRCode } from './useQRCode.js'
import { TAMANHOS, TIPOS, gerarImagem, resumo, textoSobre } from './qr.js'
import { traduzir } from './textos.js'

const props = defineProps({
  /** O sistema do app-sdk. */
  sistema: { type: Object, required: true },
  /** `{ idioma, textos, ativo, leve }`, que o index.js mantém. */
  estado: { type: Object, required: true },
})

const t = (chave) => traduzir(props.estado.textos, chave)
const q = criarQRCode({ sistema: props.sistema, t })
const estiloDoAcento = { '--qr-acento': ACENTO, '--qr-acento-rgb': '139, 92, 246' }

const raiz = ref(null)
const historicoAberto = ref(false)
const confirmarLimpeza = ref(false)
const miniaturas = reactive({})
const podeLimpar = computed(() => q.historico.value.length > 0 && !q.limpando.value)

// Uma miniatura por entrada, feita uma vez; a entrada que some leva a dela.
watch(
  q.historico,
  (entradas) => {
    const vivas = new Set(entradas.map((e) => e.id))
    for (const id of Object.keys(miniaturas)) if (!vivas.has(id)) delete miniaturas[id]
    for (const e of entradas) {
      if (miniaturas[e.id]) continue
      gerarImagem(e.texto, { tamanho: 200, frente: e.frente, fundo: e.fundo })
        .then((url) => {
          if (vivas.has(e.id)) miniaturas[e.id] = url
        })
        .catch(() => {})
    }
  },
  { immediate: true },
)

function abrirEntrada(entrada) {
  historicoAberto.value = false
  q.abrirDoHistorico(entrada)
}

onBeforeUnmount(() => q.encerrar())
</script>

<style lang="scss" scoped>
@import './qr.scss';
</style>
