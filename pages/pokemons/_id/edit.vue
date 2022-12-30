<template>
  <CalcStatsTemplate
    title="ポケモン編集"
    button-text="更新する"
    :current-pokemon.sync="currentPokemon"
    :current-nature.sync="currentNature"
    :lv.sync="lv"
    :stats="stats"
    :props-description="description"
    @submit="updatePokemon"
    @updateEffortValue="updateEffortValue"
    @updateIndividualValue="updateIndividualValue"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, ref, useContext, useRouter, watch } from '@nuxtjs/composition-api'
import { Nature, PokemonData, Stat } from '@/types/index'
import { updateMeta } from '~/utils/utilities'

export default defineComponent({
  middleware: 'auth',
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  setup() {
    updateMeta('ポケモン編集')

    const { route, store, $axios } = useContext()
    const router = useRouter()

    const currentPokemon = ref<PokemonData>({
      no: 567,
      name: 'アーケオス',
      form: '',
      ranks: [],
      evolutions: [],
      types: ['いわ', 'ひこう'],
      abilities: ['よわき'],
      hiddenAbilities: [],
      stats: [75, 140, 65, 112, 65, 110],
    })

    const currentNature = ref<Nature>({
      name: 'がんばりや',
      stats: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
    })

    const lv = ref(50)

    const stats = reactive<Stat[]>([
      {
        name: 'ＨＰ',
        initial: 'H',
        individualValue: 31,
        effortValue: null,
      },
      {
        name: 'こうげき',
        initial: 'A',
        individualValue: 31,
        effortValue: null,
      },
      {
        name: 'ぼうぎょ',
        initial: 'B',
        individualValue: 31,
        effortValue: null,
      },
      {
        name: 'とくこう',
        initial: 'C',
        individualValue: 31,
        effortValue: null,
      },
      {
        name: 'とくぼう',
        initial: 'D',
        individualValue: 31,
        effortValue: null,
      },
      {
        name: 'すばやさ',
        initial: 'S',
        individualValue: 31,
        effortValue: null,
      },
    ])

    const updatePokemon = async (params: Event): Promise<void> => {
      try {
        await $axios.patch(`/pokemons/${route.value.params.id}`, params)
        router.push(`/pokemons/${route.value.params.id}`)
      } catch (error) {
        router.push('/')
      }
    }

    const description = ref('')

    const updateEffortValue = (value: number, index: number) => {
      stats[index].effortValue = value
    }

    const updateIndividualValue = (value: number, index: number) => {
      stats[index].individualValue = value
    }

    watch(
      () => route.value.params.id,
      async () => {
        try {
          const response = await $axios.get(`/pokemons/${route.value.params.id}/edit`)

          const data = response.data.data
          currentPokemon.value = store.getters.pokemonData.find((pokemon: PokemonData) => pokemon.name === data.name)
          currentNature.value = store.getters.natureData.find((nature: Nature) => nature.name === data.nature)
          lv.value = data.lv
          stats.forEach((stat: Stat, index: number) => {
            stat.individualValue = data.individualValues[index]
            stat.effortValue = data.effortValues[index]
          })
          description.value = data.description ?? ''
        } catch {
          router.push('/')
        }
      },
      { immediate: true }
    )
    return {
      currentPokemon,
      currentNature,
      description,
      lv,
      stats,
      updateEffortValue,
      updateIndividualValue,
      updatePokemon,
    }
  },
  head: {},
})
</script>
