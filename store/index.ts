import { GetterTree, MutationTree } from 'vuex'
import { State } from '~/types'

export const state = (): State => ({
  authUser: {
    username: '',
    nickname: '',
  },
  pokemonData: [],
  natureData: [],
  ranking: [],
})

export const getters: GetterTree<State, ReturnType<typeof state>> = {
  authUser: (state) => state.authUser,
  pokemonData: (state) => state.pokemonData,
  natureData: (state) => state.natureData,
  ranking: (state) => state.ranking,
  isLogin: (state) => Boolean(state.authUser.username && state.authUser.nickname),
}

export const mutations: MutationTree<State> = {
  updateAuthUser(state, authUser) {
    state.authUser = authUser
  },
  updatePokemonData(state, value) {
    state.pokemonData = value
  },
  updateNatureData(state, value) {
    state.natureData = value
  },
  updateRanking(state, value) {
    state.ranking = value
  },
}
