<template>
  <FormTemplate title="ログイン" button-text="ログイン" :errors="errors" @submit="login">
    <EmailField :email.sync="loginParams.email" />
    <PasswordField :password.sync="loginParams.password" />
    <nuxt-link to="/register"> 新規会員登録はこちら</nuxt-link>
  </FormTemplate>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, useContext, useRoute, useRouter, useStore } from '@nuxtjs/composition-api'
import { exceptionErrorToArray } from '@/utils/error'
import { AuthUser } from '~/types'

export default defineComponent({
  setup(_) {
    const { $axios } = useContext()
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const loginParams = reactive({
      email: '',
      password: '',
    })
    const errors = ref<string[]>()

    const login = async () => {
      try {
        const response = await $axios.post<{ data: AuthUser }>('/login', loginParams)

        // メール認証済でない場合は、メール確認ページへ
        if (!response.data.data.email_verified_at) {
          localStorage.setItem('email', response.data.data.email)
          router.push('/email/resend')
          return
        }

        store.commit('updateAuthUser', response.data.data)

        if (route.value.redirectedFrom) {
          router.push(route.value.redirectedFrom)
        } else {
          router.push('/')
        }
        // TODO ログイン時に「ログインしました」のアラートを出す処理が未反映
        // notice()
      } catch (error) {
        errors.value = exceptionErrorToArray(error)
      }
    }

    return {
      errors,
      loginParams,
      login,
    }
  },
})
</script>
