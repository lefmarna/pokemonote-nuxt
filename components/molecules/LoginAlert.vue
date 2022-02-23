<template>
  <v-container :class="!$store.getters.isLogin ? '' : 'py-0'">
    <v-alert v-if="!$store.getters.isLogin" outlined type="warning" border="left">
      {{ alertTitle }}には、<span class="text-decoration-none login-alert" nuxt @click="toLogin">ログイン</span
      >が必要です。
    </v-alert>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, useContext, useRouter } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    alertTitle: {
      type: String,
      required: true,
    },
  },
  setup() {
    const { route, store } = useContext()
    const router = useRouter()

    const toLogin = () => {
      store.commit('updateRememberRoute', route.value.fullPath)
      router.push('/login')
    }
    return {
      toLogin,
    }
  },
})
</script>

<style lang="scss" scoped>
.login-alert {
  cursor: pointer;
  color: #fb8c00;
}
</style>
