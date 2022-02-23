<template>
  <v-btn color="error" elevation="2" @click="unsubscribe">退会</v-btn>
</template>

<script lang="ts">
import { defineComponent, useContext, useRouter } from '@nuxtjs/composition-api'
import { HTTP_UNAUTHORIZED } from '@/utils/constants'
import { updateMeta } from '~/utils/utilities'

export default defineComponent({
  middleware: 'auth',
  setup() {
    updateMeta('設定')

    const { $axios, store } = useContext()
    const router = useRouter()

    const unsubscribe = async () => {
      try {
        await $axios.delete(`/users/${store.getters.authUser.username}`)
      } catch (error) {
        if (!$axios.isAxiosError(error) || error.response?.status !== HTTP_UNAUTHORIZED) return
        console.log(error)
      }
      store.commit('updateAuthUser', {
        username: '',
        nickname: '',
      })
      router.replace('/login')
    }

    return {
      unsubscribe,
    }
  },
  head: {},
})
</script>
