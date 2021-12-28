import { computed, reactive } from '@nuxtjs/composition-api'
import { User } from '~/types'

export default function useAuthUser() {
  const authUser = reactive<User>({
    username: 'aa',
    nickname: 'ii',
  })

  const getAuthUser = computed(() => authUser)

  const setAuthUser = (user: User) => {
    authUser.username = user.username
    authUser.nickname = user.nickname
  }

  return {
    getAuthUser,
    setAuthUser,
  }
}

export type AuthUserStore = ReturnType<typeof useAuthUser>
