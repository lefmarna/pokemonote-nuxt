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
      :is-loading="isLoading"
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
import { computed, defineComponent, ref, useContext, useRouter } from '@nuxtjs/composition-api'
import { Nature, PokemonData, Stat } from '~/types'
import { updateMeta } from '~/utils/utilities'

export default defineComponent({
  setup() {
    updateMeta(
      'ステータス計算機（SV）',
      'ポケモンSVに対応したステータス計算機です。DLC「ゼロの秘宝 - 蒼の円盤」に登場する新ポケモンにも対応！ リアルタイムで計算が行われるため、個体値や努力値の変更を確認しながら計算できます。実数値から努力値の逆算にも対応、耐久調整を自動で行ってくれる機能も搭載しています。計算結果を投稿することで、あとから見返したり友達とシェアすることもできます！'
    )

    const { store, $axios } = useContext()
    const router = useRouter()
    const isLoading = ref(false)

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
      isLoading.value = true
      try {
        const response = await $axios.post('/pokemons', params)
        router.push(`/pokemons/${response.data.data.id}`)
      } catch (error) {
        console.log(error)
      } finally {
        isLoading.value = false
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
      isLoading,
      postPokemon,
      updateCurrentPokemon,
      updateCurrentNature,
      updateLv,
      updateEffortValue,
      updateIndividualValue,
    }
  },
  head: {},
})
</script>
