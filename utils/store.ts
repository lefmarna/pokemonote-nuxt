import { computed, useStore } from '@nuxtjs/composition-api'
import { User } from '~/types'

export const getAuthUser = computed((): User => {
  const store = useStore()
  return store.getters.getAuthUser
})
