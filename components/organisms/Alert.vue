<template>
  <transition name="notice">
    <v-alert v-if="$store.getters.notice" type="success" class="alert mb-0" width="100%">ログインしました</v-alert>
  </transition>
</template>

<style lang="scss" scoped>
.notice-enter {
  transform: translateX(-100%) !important;
}

.notice-enter-active {
  transition: transform 250ms !important;
}

.notice-enter-to {
  transform: translateX(0) !important;
}

.notice-leave {
  opacity: 1 !important;
}

.notice-leave-active {
  transition: opacity 1s !important;
}

.notice-leave-to {
  opacity: 0 !important;
}
</style>
