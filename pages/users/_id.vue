<template>
  <div v-if="user" class="user">
    <v-btn to="/users/example" nuxt />
    <!-- <v-avatar v-if="user.icon" size="36px">
      <img alt="アイコン" :src="user.icon" />
    </v-avatar> -->
    <PokemonTable :title="title" :pokemons="pokemons" />
  </div>
  <div v-else>ユーザー情報を読み込んでいます...</div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, useContext, watch } from '@nuxtjs/composition-api'
import { Pokemon, ShowUser, User } from '~/types'

export default defineComponent({
  setup() {
    const { store, route, $axios } = useContext()

    const user = ref<User>()
    const pokemons = ref<Pokemon[]>([])

    const title = computed(() => {
      if (!user.value) return ''
      if (store.getters.authUser.username === user.value.username) {
        return 'マイページ'
      } else {
        return `${user.value.nickname}さんの投稿`
      }
    })

    // コンポーネントの更新ではライフサイクルの初期化を行わないため、createdではなくwatchで監視している
    watch(
      () => route.value.params.id,
      async () => {
        try {
          const response = await $axios.get<{ data: ShowUser }>(`/users/${route.value.params.id}`)
          const data = response.data.data
          user.value = data.user
          // this.user.icon = response.data.icon;
          pokemons.value = data.pokemons
        } catch (error) {
          console.log(error)
        }
      },
      // immediate: true とすることで、初期描画時にもwatchが発火するようになる
      { immediate: true }
    )

    return {
      pokemons,
      title,
      user,
    }
  },
})
</script>
