<template>
  <PokemonTable title="ポケモン一覧" :pokemons="filteredPokemons" />
</template>

<script lang="ts">
import { computed, defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import { Pokemon } from '@/types'
import { updateMeta } from '~/utils/utilities'

export default defineComponent({
  setup() {
    updateMeta('みんなの投稿')

    const pokemons = ref<Pokemon[]>([])

    const { store, $axios } = useContext()

    /**
     * 自分の投稿したポケモンは表示させない
     */
    const filteredPokemons = computed(() => {
      const authUserName: string = store.getters.authUser.username
      if (!authUserName) return pokemons.value
      return pokemons.value.filter((pokemon: Pokemon) => pokemon.user.username !== authUserName)
    })

    ;(async () => {
      try {
        const response = await $axios.get<{ data: Pokemon[] }>('/pokemons')
        pokemons.value = response.data.data
      } catch (error) {
        console.log(error)
      }
    })()

    return {
      filteredPokemons,
    }
  },
  head: {},
})
</script>
