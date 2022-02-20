import { GetterTree, MutationTree } from 'vuex'
import { State } from '~/types'

export const state = (): State => ({
  authUser: {
    username: '',
    nickname: '',
  },
  notice: false,
  pokemonData: [],
  natureData: [],
  ranking: [],
})

export const getters: GetterTree<State, ReturnType<typeof state>> = {
  authUser: (state) => state.authUser,
  notice: (state) => state.notice,
  pokemonData: (state) => state.pokemonData,
  natureData: (state) => state.natureData,
  ranking: (state) => state.ranking,
  isLogin: (state) => Boolean(state.authUser.username && state.authUser.nickname),
}

export const mutations: MutationTree<State> = {
  updateAuthUser(state, authUser) {
    state.authUser = authUser
  },
  updateNotice(state, notice) {
    state.notice = notice
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

export const actions = {
  notice({ commit }: any) {
    commit('updateNotice', true)
    // setTimeoutで3000ms後にshowをfalseにする
    setTimeout(() => {
      commit('updateNotice', false)
    }, 2250)
  },
}
