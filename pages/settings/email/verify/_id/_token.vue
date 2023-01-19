<template>
  <div>メールアドレスの変更を確認中...</div>
</template>

<script lang="ts">
import { defineComponent, useContext, useRouter } from '@nuxtjs/composition-api'
import { updateMeta } from '~/utils/utilities'

export default defineComponent({
  middleware: 'auth',
  setup() {
    updateMeta('メールアドレスの変更を確認')

    const { $axios, route, store } = useContext()
    const router = useRouter()

    ;(async () => {
      try {
        const response = await $axios.get(
          `/settings/email/verify/${route.value.params.id}/${route.value.params.token}/?expires=${route.value.query.expires}&signature=${route.value.query.signature}`
        )
        store.commit('updateAuthUser', response.data.data)
      } catch (error) {
        console.log(error)
      } finally {
        router.push('/')
      }
    })()
  },
  head: {},
})
</script>
