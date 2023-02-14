export type Email = {
  email: string
}

export type VTextField = {
  lazyValue: number | null
  $refs: {
    input: HTMLInputElement
  }
}

export type Login = {
  email: string
  password: string
}

export type Nature = {
  name: string
  stats: number[]
}

export type PokemonData = {
  no: number
  name: string
  form: string
  ranks: string[]
  evolutions: number[]
  types: string[]
  abilities: string[]
  hiddenAbilities: string[]
  stats: number[]
  total?: number
}

export type Ranking = {
  name: string
}

export type Stat = {
  name: string
  initial: string
  individualValue: number | null
  effortValue: number | null
}

export type Tip = {
  price: number
  token: string
}

export type User = {
  nickname: string
  username: string
}

export type AuthUser = User & {
  id: number | null
  email: string
  email_verified_at: boolean
}

export type Pokemon = {
  id: number
  lv: number
  name: string
  nature: string
  stats: string
  sum_effort_value: number
  user: User
}

export type State = {
  authUser: AuthUser
  notice: boolean
  rememberRoute: string
  pokemonData: PokemonData[]
  natureData: Nature[]
  ranking: []
  currentPokemon: PokemonData
  lv: number
  currentNature: Nature
  stats: Stat[]
}

export type ShowUser = {
  user: User
  pokemons: Pokemon[]
}
