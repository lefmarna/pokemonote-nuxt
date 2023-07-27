<template>
  <v-container v-if="pokemon && pokemonDetails" class="pokemon">
    ポケモンの詳細ページは、現在コンテンツの表示を調整中です。
    <table>
      <tbody>
        <tr>
          <td class="text-left">No</td>
          <td class="text-right">{{ pokemonDetails.no }}</td>
        </tr>
        <tr>
          <td class="text-left">ポケモン名</td>
          <td class="text-right">{{ pokemon.name }}</td>
        </tr>
        <tr>
          <td class="text-left">レベル</td>
          <td class="text-right">{{ pokemon.lv }}</td>
        </tr>
        <tr>
          <td class="text-left">性格</td>
          <td class="text-right">{{ pokemon.nature }}</td>
        </tr>
        <tr>
          <td class="text-left">種族値</td>
          <td class="text-right">
            {{ pokemonDetails.stats[HP_INDEX] }}-{{ pokemonDetails.stats[ATTACK_INDEX] }}-{{
              pokemonDetails.stats[DEFENCE_INDEX]
            }}-{{ pokemonDetails.stats[SP_ATTACK_INDEX] }}-{{ pokemonDetails.stats[SP_DEFENCE_INDEX] }}-{{
              pokemonDetails.stats[SPEED_INDEX]
            }}
          </td>
        </tr>
        <tr>
          <td class="text-left">ステータス</td>
          <td class="text-right">
            {{ pokemon.stats }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="pokemon.description" class="mt-3">
      <span>ポケモンの説明</span>
      <p>
        {{ pokemon.description }}
      </p>
    </div>
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
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
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
      async (id) => {
        try {
          const response = await $axios.get<{ data: Pokemon }>(`/pokemons/${id}/show/old`)
          pokemon.value = response.data.data
        } catch (error) {
          router.push('/')
        }
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

    const deleteItem = async (id: number): Promise<void> => {
      try {
        await $axios.delete(`/pokemons/${id}`)
        router.push(`/users/${authUserName.value}`)
      } catch (error) {
        router.push('/')
      }
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
