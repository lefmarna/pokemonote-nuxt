<template>
  <div v-if="isConfirm">パスワード再設定用URLの検証中...</div>
  <v-container v-else-if="isSuccess && !isSubmit">
    <FormTemplate title="パスワード再設定" button-text="送信" :errors="errors" :is-loading="isLoading" @submit="submit">
      <PasswordField :password.sync="resetPasswordParams.new_password" label="新しいパスワード" />
      <PasswordField :password.sync="resetPasswordParams.new_password_confirmation" label="確認用パスワード" />
    </FormTemplate>
  </v-container>
  <v-container v-else>
    <Title text="パスワード再設定" />
    <p v-if="isSubmit">パスワード再設定が完了しました。</p>
    <p v-else>
      パスワード再設定用URLの検証に失敗しました。<br />
      お手数ですが再度お試しください。
    </p>
    <v-btn to="/" nuxt>トップページへ戻る</v-btn>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, useContext } from '@nuxtjs/composition-api'
import { HTTP_UNPROCESSABLE_ENTITY } from '~/utils/constants'
import { exceptionErrorToArray, updateMeta } from '~/utils/utilities'

export default defineComponent({
  middleware: 'noAuth',
  setup() {
    updateMeta('パスワード再設定')

    const { $axios, route } = useContext()
    const isConfirm = ref(true)
    const isSuccess = ref(true)
    const isLoading = ref(false)
    const isSubmit = ref(false)
    const errors = ref<string[]>([])

    const resetPasswordParams = reactive({
      new_password: '',
      new_password_confirmation: '',
    })

    ;(async () => {
      try {
        await $axios.get(
          `/password/verify/${route.value.params.id}?expires=${route.value.query.expires}&signature=${route.value.query.signature}`
        )
        isSuccess.value = true
      } catch (error) {
        console.log(error)
        isSuccess.value = false
      } finally {
        isConfirm.value = false
      }
    })()

    const submit = async () => {
      isLoading.value = true
      try {
        await $axios.put('/password/reset', resetPasswordParams)
        isSubmit.value = true
        errors.value = []
      } catch (error) {
        errors.value = exceptionErrorToArray(error, [HTTP_UNPROCESSABLE_ENTITY])
      } finally {
        isLoading.value = false
      }
    }

    return {
      isConfirm,
      isSuccess,
      isLoading,
      isSubmit,
      resetPasswordParams,
      errors,
      submit,
    }
  },
  head: {},
})
</script>
