<template>
  <v-container>
    <v-card max-width="540px" class="mx-auto mt-5">
      <!-- タイトル -->
      <v-card-title>
        <v-card-title class="mx-auto">Pokemonote - 設定</v-card-title>
      </v-card-title>
      <v-list class="py-0 mx-3" flat>
        <DialogCard title="Pokemonote - アカウント情報の変更" submit-button-text="変更する" @submit="updateUserAccount">
          <template #activator="activator">
            <v-list-item v-bind="activator.attrs" v-on="activator.on">アカウント情報の変更</v-list-item>
          </template>
          <template #content>
            <v-card-text>
              この機能は現在準備中です。<br />
              ボタンを押してもアカウント情報を変更することはできません。
            </v-card-text>
          </template>
        </DialogCard>
        <v-divider></v-divider>
        <DialogCard title="Pokemonote - パスワードの更新" submit-button-text="更新する" @submit="updatePassword">
          <template #activator="activator">
            <v-list-item v-bind="activator.attrs" v-on="activator.on">パスワードの更新</v-list-item>
          </template>
          <template #content>
            <v-card-text>
              <PasswordField :password.sync="passwordParams.currentPassword" label="現在のパスワード" />
              <PasswordField :password.sync="passwordParams.newPassword" label="新しいパスワード" />
              <PasswordField :password.sync="passwordParams.newPasswordConfirmation" label="確認用パスワード" />
            </v-card-text>
          </template>
        </DialogCard>
        <v-divider></v-divider>
        <DialogCard
          title="Pokemonote - アカウント退会"
          submit-button-text="退会する"
          :is-danger="true"
          @submit="unsubscribe"
        >
          <template #activator="activator">
            <v-list-item v-bind="activator.attrs" v-on="activator.on">退会</v-list-item>
          </template>
          <template #content>
            <v-card-text>
              これまでに投稿されたポケモンのデータも全て削除されます。<br />
              本当に退会してもよろしいですか？
            </v-card-text>
          </template>
        </DialogCard>
      </v-list>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, useContext, useRouter } from '@nuxtjs/composition-api'
import { HTTP_UNAUTHORIZED } from '@/utils/constants'
import { updateMeta } from '~/utils/utilities'

export default defineComponent({
  middleware: 'auth',
  setup() {
    updateMeta('設定')

    const { $axios, store } = useContext()
    const router = useRouter()

    const dialog = ref(false)

    const passwordParams = reactive({
      currentPassword: '',
      newPassword: '',
      newPasswordConfirmation: '',
    })

    const updateUserAccount = () => {}

    const updatePassword = async () => {
      try {
        await $axios.post('/', passwordParams)
        alert('パスワードを更新しました')
      } catch (error) {
        if (!$axios.isAxiosError(error) || error.response?.status !== HTTP_UNAUTHORIZED) return
        console.log(error)
      }
    }

    const unsubscribe = async () => {
      try {
        await $axios.delete(`/users/${store.getters.authUser.username}`)
      } catch (error) {
        if (!$axios.isAxiosError(error) || error.response?.status !== HTTP_UNAUTHORIZED) return
        console.log(error)
      }
      store.commit('updateAuthUser', {
        id: '',
        username: '',
        nickname: '',
        email: '',
        email_verified_at: false,
      })
      dialog.value = false
      router.replace('/login')
    }

    return {
      dialog,
      passwordParams,
      unsubscribe,
      updateUserAccount,
      updatePassword,
    }
  },
  head: {},
})
</script>
