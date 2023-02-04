<template>
  <FormTemplate title="メールアドレスの変更">
    <p>メールアドレスの変更はまだ完了していません。</p>
    <p>ご入力いただきましたメールアドレス宛に、変更用URLを記載した確認メールを送信いたしました。</p>
    <p>内容をご確認のうえ、メールアドレスの変更を完了してください。</p>
  </FormTemplate>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { updateMeta } from '~/utils/utilities'

export default defineComponent({
  middleware: 'auth',
  setup() {
    updateMeta('メールアドレスの変更')
  },
  head: {},
})
</script>
