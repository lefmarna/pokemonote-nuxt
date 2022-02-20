<template>
  <div>
    <!-- ポケモン名 -->
    <SearchField
      :items="$store.getters.pokemonData"
      label="ポケモン名"
      item-name="ポケモン"
      :clearable="true"
      :select-item="currentPokemon"
      @update="$emit('updatePokemon', $event)"
    />
    <v-row>
      <!-- レベル -->
      <v-col cols="4">
        <LvField :lv="lv" @update="$emit('updateLv', $event)" />
      </v-col>
      <!-- 性格 -->
      <v-col cols="8">
        <SearchField
          :items="$store.getters.natureData"
          label="性格"
          item-name="性格"
          :select-item="currentNature"
          @update="$emit('updateNature', $event)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { Nature, PokemonData } from '@/types/index'

export default defineComponent({
  props: {
    currentPokemon: {
      type: Object as PropType<PokemonData>,
      required: false,
      default: () => Object,
    },
    currentNature: {
      type: Object as PropType<Nature>,
      required: false,
      default: () => Object,
    },
    lv: {
      type: Number,
      required: false,
      default: null,
    },
  },
})
</script>
