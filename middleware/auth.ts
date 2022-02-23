import { Context } from '@nuxt/types'

export default function ({ store, route, redirect }: Context) {
  if (store.getters.isLogin) return

  store.commit('updateRememberRoute', route.fullPath)
  return redirect('/login')
}
