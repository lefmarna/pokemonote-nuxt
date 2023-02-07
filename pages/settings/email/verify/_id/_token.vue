<template>
  <div v-if="isConfirm">メールアドレスの変更を確認中...</div>
  <v-container v-else>
    <Title text="メールアドレス更新完了" />
    <p v-if="isSuccess">メールアドレスの更新が完了しました。</p>
    <p v-else>
      メールアドレスの更新に失敗しました。<br />
      お手数ですが再度お試しください。
    </p>
    <v-btn to="/" nuxt>トップページへ戻る</v-btn>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import { updateMeta } from '~/utils/utilities'

export default defineComponent({
  middleware: 'auth',
  setup() {
    updateMeta('メールアドレスの更新')

    const { $axios, route, store } = useContext()
    const isConfirm = ref(true)
    const isSuccess = ref(true)

    ;(async () => {
      try {
        const response = await $axios.get(
          `/settings/email/verify/${route.value.params.id}/${route.value.params.token}?expires=${route.value.query.expires}&signature=${route.value.query.signature}`
        )
        store.commit('updateAuthUser', response.data.data)
        isConfirm.value = false
        isSuccess.value = true
      } catch (error) {
        console.log(error)
        isSuccess.value = false
      }
    })()

    return {
      isConfirm,
      isSuccess,
    }
  },
  head: {},
})
</script>
