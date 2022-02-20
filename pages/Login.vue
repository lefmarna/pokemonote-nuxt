<template>
  <FormTemplate title="ログイン" button-text="ログイン" :errors="errors" @submit="login">
    <EmailField :email.sync="loginParams.email" />
    <PasswordField :password.sync="loginParams.password" />
    <nuxt-link to="/register"> 新規会員登録はこちら</nuxt-link>
  </FormTemplate>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, useContext, useRouter } from '@nuxtjs/composition-api'
import { exceptionErrorToArray } from '@/utils/error'
import { AuthUser } from '~/types'

export default defineComponent({
  setup(_) {
    const { $axios, route, store } = useContext()
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
        store.dispatch('notice')
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
