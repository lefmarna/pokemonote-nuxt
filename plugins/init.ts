import { Context } from '@nuxt/types'

export default async function ({ $axios, store }: Context) {
  try {
    const response = await $axios.get('init')
    const data = response.data.data
    store.commit('updateAuthUser', data.auth_user)
    store.commit('updatePokemonData', data.pokemon_data)
    store.commit('updateNatureData', data.nature_data)
  } catch (error) {
    console.log(error)
  }
}
