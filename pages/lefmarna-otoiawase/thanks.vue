<template>
  <v-container>
    <Title text="お問い合わせ" />
    <p>
      この度はお問い合わせいただきありがとうございます。<br />
      メールを確認次第、ご連絡をさせていただきます。
    </p>
    <v-btn to="/" nuxt>トップページへ戻る</v-btn>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { updateMeta } from '~/utils/utilities'

export default defineComponent({
  setup() {
    updateMeta('送信成功')
  },
  head: {},
})
</script>
