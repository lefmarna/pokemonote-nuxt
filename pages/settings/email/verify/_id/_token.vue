<template>
  <div v-if="isConfirm">メールアドレスの変更を確認中...</div>
  <v-container v-else>
    <Title text="メールアドレス更新完了" />
    <p>メールアドレスの更新が完了しました。</p>
    <v-btn to="/" nuxt>トップページへ戻る</v-btn>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, useContext, useRouter } from '@nuxtjs/composition-api'
import { updateMeta } from '~/utils/utilities'

export default defineComponent({
  middleware: 'auth',
  setup() {
    updateMeta('メールアドレスの更新')

    const { $axios, route, store } = useContext()
    const router = useRouter()
    const isConfirm = ref(true)

    ;(async () => {
      try {
        const response = await $axios.get(
          `/settings/email/verify/${route.value.params.id}/${route.value.params.token}/?expires=${route.value.query.expires}&signature=${route.value.query.signature}`
        )
        store.commit('updateAuthUser', response.data.data)
        isConfirm.value = false
      } catch (error) {
        console.log(error)
        router.push('/')
      }
    })()

    return {
      isConfirm,
    }
  },
  head: {},
})
</script>
