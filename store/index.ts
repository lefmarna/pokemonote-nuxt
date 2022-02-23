import { GetterTree, MutationTree } from 'vuex'
import { State } from '~/types'

export const state = (): State => ({
  authUser: {
    username: '',
    nickname: '',
  },
  notice: false,
  rememberRoute: '',
  pokemonData: [],
  natureData: [],
  ranking: [],

  // 初期値を用意しておく
  currentPokemon: {
    no: 567,
    name: 'アーケオス',
    form: '',
    ranks: [],
    evolutions: [],
    types: ['いわ', 'ひこう'],
    abilities: ['よわき'],
    hiddenAbilities: [],
    stats: [75, 140, 65, 112, 65, 110],
  },
  lv: 50,
  currentNature: {
    name: 'がんばりや',
    stats: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
  },
  // 各種ステータス
  stats: [
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
  ],
})

export const getters: GetterTree<State, ReturnType<typeof state>> = {
  authUser: (state) => state.authUser,
  notice: (state) => state.notice,
  rememberRoute: (state) => state.rememberRoute,
  pokemonData: (state) => state.pokemonData,
  natureData: (state) => state.natureData,
  ranking: (state) => state.ranking,
  currentPokemon: (state) => state.currentPokemon,
  currentNature: (state) => state.currentNature,
  lv: (state) => state.lv,
  stats: (state) => state.stats,
  isLogin: (state) => Boolean(state.authUser.username && state.authUser.nickname),
}

export const mutations: MutationTree<State> = {
  updateAuthUser(state, authUser) {
    state.authUser = authUser
  },
  updateNotice(state, notice) {
    state.notice = notice
  },
  updateRememberRoute(state, rememberRoute) {
    state.rememberRoute = rememberRoute
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
  updateCurrentPokemon(state, selectedPokemon) {
    state.currentPokemon = selectedPokemon
  },
  updateCurrentNature(state, selectedNature) {
    state.currentNature = selectedNature
  },
  updateLv(state, value) {
    state.lv = value
  },
  updateStats(state, value) {
    state.stats = value
  },
  updateEffortValue(state, { value, index }) {
    state.stats[index].effortValue = value
  },
  updateIndividualValue(state, { value, index }) {
    state.stats[index].individualValue = value
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
