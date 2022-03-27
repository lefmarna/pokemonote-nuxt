<template>
  <FormTemplate name="form" title="アカウント作成" button-text="新規登録" :errors="errors" @submit="register">
    <!-- <v-file-input
      accept="image/jpeg, image/png"
      name="icon"
      label="アイコン"
    ></v-file-input> -->
    <v-text-field
      v-model="username"
      name="username"
      prepend-icon="mdi-account"
      label="ユーザー名"
      placeholder="英数5〜15文字で入力してください。"
      :rules="[rules.required, rules.username]"
      counter
      persistent-placeholder
    />
    <v-text-field
      v-model="nickname"
      name="nickname"
      prepend-icon="mdi-account-outline"
      label="ニックネーム"
      placeholder="4〜50文字で入力してください。"
      :rules="[rules.required, rules.nickname]"
      counter
      persistent-placeholder
    />
    <EmailField :email.sync="email" name="email" />
    <PasswordField :password.sync="password" name="password" />
    <PasswordField :password.sync="passwordConfirmation" name="password_confirmation" label="パスワード確認" />
  </FormTemplate>
</template>

<script lang="ts">
import { computed, defineComponent, ref, useContext, useRouter } from '@nuxtjs/composition-api'
import { exceptionErrorToArray, updateMeta } from '@/utils/utilities'
import { Email } from '~/types'

export default defineComponent({
  middleware: 'noAuth',
  setup() {
    updateMeta('アカウント作成')

    const { $axios } = useContext()
    const router = useRouter()
    // const image = ref();
    const username = ref<string>('')
    const nickname = ref<string>('')
    const email = ref<string>('')
    const password = ref<string>('')
    const passwordConfirmation = ref<string>('')
    const errors = ref<string[]>()

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

    const register = async (): Promise<void> => {
      // 画像のデータはformDataを介さないと送れない
      const form = document.forms.namedItem('form')
      if (!form) return
      const formData = new FormData(form)

      try {
        const response = await $axios.post<{ data: Email }>('/register', formData)
        localStorage.setItem('email', response.data.data.email)
        router.push('/email/resend')
      } catch (error) {
        errors.value = exceptionErrorToArray(error)
      }
    }

    return {
      username,
      nickname,
      email,
      password,
      passwordConfirmation,
      rules,
      errors,
      register,
    }
  },
  head: {},
})
</script>
