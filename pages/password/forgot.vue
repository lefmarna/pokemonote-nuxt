<template>
  <FormTemplate
    title="パスワード再設定"
    button-text="パスワード再設定"
    :errors="errors"
    :is-loading="isLoading"
    @submit="login"
  >
    <EmailField :email.sync="email" />
  </FormTemplate>
</template>

<script lang="ts">
import { defineComponent, ref, useContext, useRouter } from '@nuxtjs/composition-api'
import { exceptionErrorToArray, updateMeta } from '@/utils/utilities'

export default defineComponent({
  middleware: 'noAuth',
  setup() {
    updateMeta('パスワード再設定')

    const { $axios } = useContext()
    const router = useRouter()

    const email = ref('')

    const isLoading = ref(false)
    const errors = ref<string[]>()

    const login = async () => {
      isLoading.value = true

      try {
        const response = await $axios.post('/password/email', {
          email: email.value,
        })

        router.push('/password/confirm')

        console.log(response)
      } catch (error) {
        errors.value = exceptionErrorToArray(error)
      } finally {
        isLoading.value = false
      }
    }

    return {
      email,
      errors,
      isLoading,
      login,
    }
  },
  head: {},
})
</script>
