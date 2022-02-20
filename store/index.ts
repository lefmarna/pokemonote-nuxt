import { GetterTree, MutationTree } from 'vuex'
import { State } from '~/types'

export const state = (): State => ({
  authUser: {
    username: '',
    nickname: '',
  },
})

export const getters: GetterTree<State, ReturnType<typeof state>> = {
  authUser: (state) => state.authUser,
  isLogin: (state) => Boolean(state.authUser.username && state.authUser.nickname),
}

export const mutations: MutationTree<State> = {
  updateAuthUser(state, authUser) {
    state.authUser = authUser
  },
}
