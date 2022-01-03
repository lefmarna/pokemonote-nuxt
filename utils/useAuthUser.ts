import { computed, InjectionKey, reactive } from '@nuxtjs/composition-api'
import { User } from '~/types'

export default function useAuthUser() {
  const authUser = reactive<User>({
    username: '',
    nickname: '',
  })

  const getAuthUser = computed(() => authUser)

  const isLogin = computed(() => {
    return Boolean(getAuthUser.value.username && getAuthUser.value.username)
  })

  const setAuthUser = (user: User) => {
    authUser.username = user.username
    authUser.nickname = user.nickname
  }

  return {
    getAuthUser,
    isLogin,
    setAuthUser,
  }
}

export type AuthUserStore = ReturnType<typeof useAuthUser>
export const AuthUserKey: InjectionKey<AuthUserStore> = Symbol('AuthUserStore')
