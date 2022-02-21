<template>
  <div>メール認証中...</div>
</template>

<script lang="ts">
import { defineComponent, useContext, useRouter } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { $axios, route, store } = useContext()
    const router = useRouter()

    ;(async () => {
      try {
        const response = await $axios.get(
          `/email/verify/${route.value.params.id}?expires=${route.value.query.expires}&signature=${route.value.query.signature}`
        )
        store.commit('updateAuthUser', response.data.data)
        store.dispatch('notice')
      } catch (error) {
        console.log(error)
      }
      router.push('/')
    })()
  },
})
</script>
