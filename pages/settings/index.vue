<template>
  <v-container>
    <v-card max-width="540px" class="mx-auto mt-5">
      <!-- タイトル -->
      <v-card-title>
        <v-card-title class="mx-auto">Pokemonote - 設定</v-card-title>
      </v-card-title>
      <v-list class="py-0 mx-3" flat>
        <DialogCard
          title="Pokemonote - アカウント情報の変更"
          submit-button-text="変更する"
          @submit="updateAccount($event)"
        >
          <template #activator="activator">
            <v-list-item v-bind="activator.attrs" v-on="activator.on">アカウント情報の変更</v-list-item>
          </template>
          <template #content>
            <v-card-text>
              <v-text-field
                v-model="updateAccountParams.username"
                prepend-icon="mdi-account"
                label="ユーザー名"
                placeholder="英数5〜15文字で入力してください。"
                :rules="[rules.required, rules.username]"
                counter
                persistent-placeholder
              />
              <v-text-field
                v-model="updateAccountParams.nickname"
                prepend-icon="mdi-account-outline"
                label="ニックネーム"
                placeholder="4〜50文字で入力してください。"
                :rules="[rules.required, rules.nickname]"
                counter
                persistent-placeholder
              />
            </v-card-text>
            <v-list>
              <v-list-item v-for="(error, index) in updateAccountErrors" :key="index">
                <v-list-item-icon>
                  <v-icon class="error-message">mdi-alert-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="error-message">{{ error }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </template>
        </DialogCard>
        <v-divider></v-divider>
        <DialogCard
          title="Pokemonote - メールアドレスの変更"
          submit-button-text="確認メールを送信する"
          @submit="updateEmail()"
        >
          <template #activator="activator">
            <v-list-item v-bind="activator.attrs" v-on="activator.on">メールアドレスの変更</v-list-item>
          </template>
          <template #content>
            <v-card-text>
              <EmailField :email.sync="updateEmailParams.current_email" label="現在のメールアドレス" />
              <EmailField :email.sync="updateEmailParams.new_email" label="新しいメールアドレス" />
              <EmailField
                :email.sync="updateEmailParams.new_email_confirmation"
                label="新しいメールアドレス（確認用）"
              />
            </v-card-text>
            <v-list>
              <v-list-item v-for="(error, index) in updateEmailErrors" :key="index">
                <v-list-item-icon>
                  <v-icon class="error-message">mdi-alert-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="error-message">{{ error }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </template>
        </DialogCard>
        <v-divider></v-divider>
        <DialogCard
          title="Pokemonote - パスワードの更新"
          submit-button-text="更新する"
          @submit="updatePassword($event)"
        >
          <template #activator="activator">
            <v-list-item v-bind="activator.attrs" v-on="activator.on">パスワードの更新</v-list-item>
          </template>
          <template #content>
            <v-card-text>
              <PasswordField :password.sync="passwordParams.current_password" label="現在のパスワード" />
              <PasswordField :password.sync="passwordParams.new_password" label="新しいパスワード" />
              <PasswordField :password.sync="passwordParams.new_password_confirmation" label="確認用パスワード" />
            </v-card-text>
            <v-list>
              <v-list-item v-for="(error, index) in updatePasswordErrors" :key="index">
                <v-list-item-icon>
                  <v-icon class="error-message">mdi-alert-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="error-message">{{ error }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
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
import { computed, defineComponent, reactive, ref, useContext, useRouter } from '@nuxtjs/composition-api'
import { HTTP_UNAUTHORIZED, HTTP_UNPROCESSABLE_ENTITY } from '@/utils/constants'
import { exceptionErrorToArray, updateMeta } from '~/utils/utilities'

export default defineComponent({
  middleware: 'auth',
  setup() {
    updateMeta('設定')

    const { $axios, store } = useContext()
    const router = useRouter()
    const updateAccountErrors = ref<string[]>([])
    const updateEmailErrors = ref<string[]>([])
    const updatePasswordErrors = ref<string[]>([])

    const dialog = ref(false)

    const updateAccountParams = reactive({
      username: '',
      nickname: '',
    })

    const updateEmailParams = reactive({
      current_email: '',
      new_email: '',
      new_email_confirmation: '',
    })

    const passwordParams = reactive({
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    })

    const rules = computed(() => {
      return {
        required: (value: string) => !!value || 'この項目は必須です',
        username: (value: string) => {
          const pattern = /^[a-z\d]{5,15}$/i
          return pattern.test(value) || '英数5〜15文字で入力してください。'
        },
        nickname: (value: string) => {
          const length = value.length
          return (length >= 4 && length <= 50) || '4〜50文字で入力してください。'
        },
      }
    })

    const updateAccount = async (closeDialog: Function) => {
      try {
        const response = await $axios.put('/settings/account', updateAccountParams)
        alert('ユーザー情報を更新しました')
        closeDialog()
        updateAccountParams.username = ''
        updateAccountParams.nickname = ''
        updateAccountErrors.value = []
        store.commit('updateAuthUser', response.data.data)
      } catch (error) {
        updateAccountErrors.value = exceptionErrorToArray(error, [HTTP_UNAUTHORIZED, HTTP_UNPROCESSABLE_ENTITY])
      }
    }

    const updateEmail = async () => {
      try {
        const response = await $axios.post('/settings/email', updateEmailParams)
        localStorage.setItem('email', response.data.data.email)
        router.push('/settings/email/resend')
      } catch (error) {
        updateEmailErrors.value = exceptionErrorToArray(error, [HTTP_UNAUTHORIZED, HTTP_UNPROCESSABLE_ENTITY])
      }
    }

    const updatePassword = async (closeDialog: Function) => {
      try {
        await $axios.put('/settings/password', passwordParams)
        alert('パスワードを更新しました')
        closeDialog()
        passwordParams.current_password = ''
        passwordParams.new_password = ''
        passwordParams.new_password_confirmation = ''
        updatePasswordErrors.value = []
      } catch (error) {
        updatePasswordErrors.value = exceptionErrorToArray(error, [HTTP_UNAUTHORIZED, HTTP_UNPROCESSABLE_ENTITY])
      }
    }

    const unsubscribe = async () => {
      try {
        await $axios.delete(`/settings/unsubscribe`)
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
      updateAccountParams,
      updateAccountErrors,
      updateEmailParams,
      updateEmailErrors,
      updatePasswordErrors,
      passwordParams,
      rules,
      unsubscribe,
      updateAccount,
      updateEmail,
      updatePassword,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.error-message {
  color: #d32f2f;
}
</style>
