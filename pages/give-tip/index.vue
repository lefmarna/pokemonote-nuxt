<template>
  <FormTemplate
    title="チップを贈る"
    button-text="チップを贈る"
    :errors="errors"
    :is-loading="isLoading"
    @submit="giveTip"
  >
    <v-card-subtitle>
      この機能は、現在テストモードで動作しています。<br />挙動は確認できますが、お金が引き落とされることはありません。
    </v-card-subtitle>
    <v-select
      v-model="tip.price"
      :items="GIFTS"
      item-text="name"
      item-value="value"
      prepend-icon="mdi-gift"
      label="金額"
      type="number"
    ></v-select>
    <div id="payjp-form"></div>
  </FormTemplate>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, useContext, useRouter } from '@nuxtjs/composition-api'
import { GIFTS, HTTP_PAYMENT_REQUIRED, HTTP_UNPROCESSABLE_ENTITY } from '@/utils/constants'
import { exceptionErrorToArray, updateMeta } from '@/utils/utilities'
import { Tip } from '@/types'

// Payjpに型を指定しないとエラーになる
declare global {
  interface Window {
    Payjp: (payjpPublicKey: string) => any
  }
}

type Card = {
  mount: (id: string) => void
}

type Element = {
  create: (type: string, options?: object) => Card
}

type Payjp = {
  elements: (options?: object) => Element
  createToken: (card: Card) => Promise<{ id?: string; error: { message: string } }>
}

export default defineComponent({
  middleware: 'auth',
  setup() {
    updateMeta('チップを贈る')

    const { $axios, $config } = useContext()
    const router = useRouter()
    const errors = ref<string[]>()
    const isLoading = ref(false)

    const payjp = ref<Payjp>()
    const card = ref<Card>()

    const tip = reactive<Tip>({
      price: 0,
      token: '',
    })

    /**
     * 公開鍵を読み込む
     */
    onMounted(() => {
      payjp.value = window.Payjp($config.payjpPublicKey)
      if (payjp.value === undefined) return

      const elements = payjp.value.elements()
      card.value = elements.create('card')
      card.value.mount('#payjp-form')
    })

    const giveTip = async () => {
      if (payjp.value === undefined) return
      if (card.value === undefined) return

      isLoading.value = true
      try {
        const response = await payjp.value.createToken(card.value)
        if (response.error || response.id === undefined) {
          errors.value = [response.error.message]
          return
        }
        tip.token = response.id

        await $axios.post('/tips', tip)
        router.push('/give-tip/thanks')
        tip.token = ''
      } catch (e) {
        console.log(e)
        errors.value = exceptionErrorToArray(e, [HTTP_PAYMENT_REQUIRED, HTTP_UNPROCESSABLE_ENTITY])
      } finally {
        isLoading.value = false
      }
    }
    return {
      GIFTS,
      errors,
      tip,
      isLoading,
      giveTip,
    }
  },
  head: {},
})
</script>
