import { GetterTree, MutationTree } from 'vuex'
import { State } from '~/types'

export const state = (): State => ({
  authUser: {
    username: '',
    nickname: '',
  },
})

export const getters: GetterTree<State, ReturnType<typeof state>> = {
  getAuthUser: (state) => state.authUser,
}

export const mutations: MutationTree<State> = {
  setAuthUser(state, authUser) {
    state.authUser = authUser
  },
}
