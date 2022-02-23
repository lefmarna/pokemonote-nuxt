<template>
  <div>
    <LoginAlert alert-title="計算結果の保存" />
    <CalcStatsTemplate
      title="ステータス計算機"
      button-text="投稿する"
      :current-pokemon="currentPokemon"
      :current-nature="currentNature"
      :lv="lv"
      :stats="stats"
      @submit="postPokemon"
      @update:currentPokemon="updateCurrentPokemon"
      @update:currentNature="updateCurrentNature"
      @update:lv="updateLv"
      @updateEffortValue="updateEffortValue"
      @updateIndividualValue="updateIndividualValue"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, useContext, useRouter } from '@nuxtjs/composition-api'
import { Nature, PokemonData, Stat } from '~/types'

export default defineComponent({
  setup() {
    const { store, $axios } = useContext()
    const router = useRouter()

    const currentNature = computed((): Nature => {
      return store.getters.currentNature
    })

    const currentPokemon = computed((): PokemonData => {
      return store.getters.currentPokemon
    })

    const lv = computed((): number => {
      return store.getters.lv
    })

    const stats = computed((): Stat[] => {
      return store.getters.stats
    })

    const postPokemon = async (params: Event): Promise<void> => {
      try {
        const response = await $axios.post('/pokemons', params)
        router.push(`/pokemons/${response.data.data.id}`)
      } catch (error) {
        console.log(error)
      }
    }

    const updateCurrentPokemon = (pokemonData: PokemonData) => {
      store.commit('updateCurrentPokemon', pokemonData)
    }

    const updateCurrentNature = (nature: Nature) => {
      store.commit('updateCurrentNature', nature)
    }

    const updateLv = (lv: number) => {
      store.commit('updateLv', lv)
    }

    const updateEffortValue = (value: number, index: number) => {
      store.commit('updateEffortValue', { value, index })
    }

    const updateIndividualValue = (value: number, index: number) => {
      store.commit('updateIndividualValue', { value, index })
    }

    return {
      currentNature,
      currentPokemon,
      lv,
      stats,
      postPokemon,
      updateCurrentPokemon,
      updateCurrentNature,
      updateLv,
      updateEffortValue,
      updateIndividualValue,
    }
  },
})
</script>
