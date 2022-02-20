<template>
  <v-container :class="!$store.getters.isLogin ? '' : 'py-0'">
    <v-alert v-if="!$store.getters.isLogin" outlined type="warning" border="left">
      {{ alertTitle }}には、<router-link
        class="text-decoration-none login-alert"
        :to="`/login?redirect=${$route.fullPath}`"
        nuxt
        >ログイン</router-link
      >が必要です。
    </v-alert>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    alertTitle: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.login-alert {
  color: #fb8c00;
}
</style>
