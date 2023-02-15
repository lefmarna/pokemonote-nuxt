<template>
  <ins
    style="display: block"
    data-ad-client="ca-pub-3240586325286249"
    data-ad-slot="4559543564"
    data-ad-format="auto"
    data-full-width-responsive="true"
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
