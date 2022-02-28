export interface Card {
  number: string
  cvc: string
  exp_month: string
  exp_year: string
}

export interface Email {
  email: string
}

export interface VTextField {
  lazyValue: number | null
  $refs: {
    input: HTMLInputElement
  }
}

export interface Login {
  email: string
  password: string
}

export interface Nature {
  name: string
  stats: number[]
}

export interface PokemonData {
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

export interface Ranking {
  name: string
}

export interface Stat {
  name: string
  initial: string
  individualValue: number | null
  effortValue: number | null
}

export interface Tip {
  price: number
  token: string
}

export interface User {
  nickname: string
  username: string
}

export interface AuthUser extends User {
  id: number | null
  email: string
  email_verified_at: boolean
}

export interface Pokemon {
  id: number
  lv: number
  name: string
  nature: string
  stats: string
  sum_effort_value: number
  user: User
}

export interface State {
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

export interface ShowUser {
  user: User
  pokemons: Pokemon[]
}
