import { InjectionKey } from '@nuxtjs/composition-api'
import { AuthUserStore } from './useAuthUser'

export const AuthUserKey: InjectionKey<AuthUserStore> = Symbol('AuthUserStore')
