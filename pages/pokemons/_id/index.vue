<template>
  <v-container v-if="pokemon && pokemonDetails" class="pokemon">
    ポケモンの詳細ページは、現在コンテンツの表示を調整中です。
    <v-row>No. {{ pokemonDetails.no }}</v-row>
    <v-row>{{ pokemonDetails.name }}</v-row>
    <v-row>
      <ul v-for="(types, index) in pokemonDetails.types" :key="index">
        <li>{{ types }}</li>
      </ul>
    </v-row>
    <v-row>
      <ul v-for="(abilities, index) in pokemonDetails.abilities" :key="index">
        <li>{{ abilities }}</li>
      </ul>
    </v-row>
    <v-row> {{ pokemonDetails.hiddenAbilities }}</v-row>
    <v-row
      >{{ pokemonDetails.stats[HP_INDEX] }}-{{ pokemonDetails.stats[ATTACK_INDEX] }}-{{
        pokemonDetails.stats[DEFENCE_INDEX]
      }}-{{ pokemonDetails.stats[SP_ATTACK_INDEX] }}-{{ pokemonDetails.stats[SP_DEFENCE_INDEX] }}-{{
        pokemonDetails.stats[SPEED_INDEX]
      }}</v-row
    >

    <!-- {{ pokemonDetails.types[0] }} -->
    {{ pokemonDetails }}
    <!-- <p>表示名：{{ pokemon.user.name }}</p> -->
    <!-- マイページのときは、編集・削除ボタンを表示する -->
    <v-row v-if="pokemon.user.username == authUserName">
      <v-col align="center">
        <v-btn color="accent" @click="editItem(pokemon)">編集</v-btn>
      </v-col>
      <v-col align="center">
        <v-btn color="error" @click="deleteItem(pokemon.id)">削除</v-btn>
      </v-col>
    </v-row>
    <!-- マイページでないときは、ユーザー名にリンクを設定する -->
    <div v-else>
      投稿者：<nuxt-link :to="`/users/${pokemon.user.username}`">
        {{ pokemon.user.nickname }}
      </nuxt-link>
    </div>
  </v-container>
  <div v-else>ポケモン情報を読み込んでいます...</div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, useContext, useRouter } from '@nuxtjs/composition-api'
import { Pokemon, PokemonData } from '@/types/index'
import {
  ATTACK_INDEX,
  DEFENCE_INDEX,
  HP_INDEX,
  SPEED_INDEX,
  SP_ATTACK_INDEX,
  SP_DEFENCE_INDEX,
} from '@/utils/constants'
import { updateMeta } from '~/utils/utilities'

export default defineComponent({
  setup() {
    updateMeta('ポケモン詳細')

    const { route, store, $axios } = useContext()
    const router = useRouter()

    const pokemon = ref()

    // ポケモンの詳細情報をVuexから取得する
    const pokemonDetails = computed(() => {
      const pokemonData: PokemonData[] = store.getters.pokemonData
      return pokemonData.find((data) => data.name === pokemon.value.name)
    })

    const authUserName = computed((): string => {
      return store.getters.authUser.username
    })

    //  コンポーネントの更新ではライフサイクルの初期化を行わないため、watchで監視する形で実装している
    watch(
      () => route.value.params.id,
      (id) => {
        $axios
          .get(`/pokemons/${id}`)
          .then((response) => {
            pokemon.value = response.data.data
          })
          .catch((error) => {
            console.log(error)
          })
      },
      { immediate: true }
    )

    const editItem = (item: Pokemon): void => {
      if (item.user.username === authUserName.value) {
        router.push(`/pokemons/${item.id}/edit`)
      } else {
        router.push('/')
      }
    }

    const deleteItem = (id: number): void => {
      $axios
        .delete(`/pokemons/${id}`)
        .then(() => {
          router.push(`/users/${authUserName.value}`)
        })
        .catch(() => {
          router.push('/')
        })
    }

    return {
      HP_INDEX,
      ATTACK_INDEX,
      DEFENCE_INDEX,
      SP_ATTACK_INDEX,
      SP_DEFENCE_INDEX,
      SPEED_INDEX,
      authUserName,
      pokemon,
      pokemonDetails,
      editItem,
      deleteItem,
    }
  },
  head: {},
})
</script>
