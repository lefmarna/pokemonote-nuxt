<template>
  <DialogCard title="Pokemonote - アカウント退会" submit-button-text="退会する" :is-danger="true" @submit="unsubscribe">
    <template #activator="activator">
      <v-btn color="danger white--text" elevation="2" v-bind="activator.attrs" v-on="activator.on">退会</v-btn>
    </template>
    <template #content>
      <v-card-text>
        これまでに投稿されたポケモンのデータも全て削除されます。<br />
        本当に退会してもよろしいですか？
      </v-card-text>
    </template>
  </DialogCard>
</template>

<script lang="ts">
import { defineComponent, ref, useContext, useRouter } from '@nuxtjs/composition-api'
import { HTTP_UNAUTHORIZED } from '@/utils/constants'
import { updateMeta } from '~/utils/utilities'

export default defineComponent({
  middleware: 'auth',
  setup() {
    updateMeta('設定')

    const { $axios, store } = useContext()
    const router = useRouter()

    const dialog = ref(false)

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
      dialog.value = false
      router.replace('/login')
    }

    return {
      dialog,
      unsubscribe,
    }
  },
  head: {},
})
</script>
