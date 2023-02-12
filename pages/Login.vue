<template>
  <FormTemplate title="ログイン" button-text="ログイン" :errors="errors" :is-loading="isLoading" @submit="login">
    <template #default>
      <EmailField :email.sync="loginParams.email" />
      <PasswordField :password.sync="loginParams.password" />
    </template>
    <template #links>
      <div>
        <nuxt-link to="/register">新規会員登録はこちら</nuxt-link>
      </div>
      <div class="mt-3">
        <nuxt-link to="/password/forgot">パスワードをお忘れの方はこちら</nuxt-link>
      </div>
    </template>
  </FormTemplate>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, reactive, ref, useContext, useRouter } from '@nuxtjs/composition-api'
import { exceptionErrorToArray, updateMeta } from '@/utils/utilities'
import { AuthUser } from '~/types'

export default defineComponent({
  middleware: 'noAuth',
  setup() {
    updateMeta('ログイン')

    const { $axios, store } = useContext()
    const router = useRouter()

    const loginParams = reactive({
      email: '',
      password: '',
    })
    const isLoading = ref(false)
    const errors = ref<string[]>()

    const login = async () => {
      isLoading.value = true
      try {
        // await $axios.get('csrf-cookie')
        const response = await $axios.post<{ data: AuthUser }>('/login', loginParams)

        // メール認証済でない場合は、メール確認ページへ
        if (!response.data.data.email_verified_at) {
          localStorage.setItem('email', response.data.data.email)
          router.push('/email/resend')
          return
        }

        store.commit('updateAuthUser', response.data.data)

        if (store.getters.rememberRoute) {
          router.push(store.getters.rememberRoute)
        } else {
          router.push('/')
        }
        store.dispatch('notice')
      } catch (error) {
        errors.value = exceptionErrorToArray(error)
      } finally {
        isLoading.value = false
      }
    }

    onUnmounted(() => {
      store.commit('updateRememberRoute', '')
    })

    return {
      errors,
      isLoading,
      loginParams,
      login,
    }
  },
  head: {},
})
</script>
