<template>
  <v-container>
    <form @submit.prevent="handleSubmit">
      <v-card max-width="540px" class="mx-auto mt-5">
        <v-card-title>
          <v-card-title class="mx-auto">Pokemonote - お問い合わせ</v-card-title>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="name" type="text" name="name" prepend-icon="mdi-account" label="お名前" />
          <v-text-field v-model="email" type="email" name="email" prepend-icon="mdi-email" label="メールアドレス" />
          <v-textarea
            v-model="message"
            name="message"
            outlined
            prepend-icon="mdi-card-text"
            label="お問い合わせ内容"
          ></v-textarea>
          <v-card-actions>
            <v-btn type="submit" class="mx-auto px-5" color="info" large>送信する</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </form>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, useContext, useRouter } from '@nuxtjs/composition-api'
import { updateMeta } from '~/utils/utilities'

export default defineComponent({
  setup() {
    updateMeta('お問い合わせ')

    const { $axios } = useContext()
    const router = useRouter()
    const name = ref<string>()
    const email = ref<string>()
    const message = ref<string>()

    const handleSubmit = async () => {
      try {
        await $axios.post('/lefmarna-otoiawase', {
          name: name.value,
          email: email.value,
          message: message.value,
        })
        router.push('/lefmarna-otoiawase/thanks')
      } catch (error) {
        router.push('/')
      }
    }

    return {
      name,
      email,
      message,
      handleSubmit,
    }
  },
  head: {},
})
</script>
