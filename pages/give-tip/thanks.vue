<template>
  <v-container>
    <Title text="チップを贈る" />
    <p>
      応援ありがとうございます。<br />
      引き続き『Pokemonote』をよろしくお願いします。
    </p>
    <v-btn to="/" nuxt>トップページへ戻る</v-btn>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { updateMeta } from '~/utils/utilities'

export default defineComponent({
  setup() {
    updateMeta('応援ありがとう')
  },
  head: {},
})
</script>
