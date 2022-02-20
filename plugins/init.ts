import { Context } from '@nuxt/types'

export default function ({ store }: Context) {
  const user = { username: 'aa', nickname: 'ii' }
  store.commit('updateAuthUser', user)
}
