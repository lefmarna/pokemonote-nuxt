<template>
  <ins
    class="adsbygoogle"
    style="display: inline-block; width: 232px; height: 232px"
    data-ad-client="ca-pub-3240586325286249"
    data-ad-slot="2573612278"
  ></ins>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted } from '@nuxtjs/composition-api'

declare global {
  interface Window {
    adsbygoogle: any
  }
}

export default defineComponent({
  setup() {
    onMounted(() => {
      nextTick(() => {
        try {
          ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch (error) {
          console.error(error)
        }
      })
    })
  },
})
</script>
