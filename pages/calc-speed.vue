<template>
  <v-container>
    <Title text="素早さ計算機（ポケモンSV）" />
    <v-row>
      <v-col cols="12" md="6" class="d-flex">
        <v-container :class="$vuetify.breakpoint.xs ? 'px-0' : ''">
          <StatsTableHeader
            :current-pokemon="currentPokemon"
            :current-nature="currentNature"
            :lv="lv"
            @updatePokemon="$store.commit('updateCurrentPokemon', $event)"
            @updateNature="$store.commit('updateCurrentNature', $event)"
            @updateLv="$store.commit('updateLv', $event)"
          />
          <!-- ステータス -->
          <div class="statsTable">
            <v-row>
              <!-- 種族値 -->
              <BaseStatsField
                :base-stat="currentPokemon.stats[SPEED_INDEX]"
                :stats-initial="stats[SPEED_INDEX].initial"
                :nature-stat="currentNature.stats[SPEED_INDEX]"
              />
              <!-- 個体値 -->
              <IndividualValueField
                :stats="stats"
                :stats-index="SPEED_INDEX"
                @updateIndividualValue="updateIndividualValue"
              />
              <!-- 努力値 -->
              <EffortValueField :stats="stats" :stats-index="SPEED_INDEX" @updateEffortValue="updateEffortValue" />
              <!-- 実数値 -->
              <RealNumberField
                :real-number="speed"
                :stats="stats"
                :stats-index="SPEED_INDEX"
                @updateRealNumber="setSpeed"
              />
            </v-row>
          </div>
          <!-- 道具 -->
          <div class="px-0 pt-3">
            <div>
              <div>
                <v-select
                  v-model="selectItem"
                  :items="SPEED_ITEMS"
                  item-text="name"
                  item-value="value"
                  label="道具"
                ></v-select>
              </div>
              <!-- 特性 -->
              <div>
                <v-select
                  v-model="selectAbility"
                  :items="SPEED_ABILITIES"
                  item-text="name"
                  item-value="value"
                  label="特性"
                ></v-select>
              </div>
            </div>
            <!-- 状態 -->
            <div class="d-flex pa-3">
              <v-checkbox
                v-model="tailwind"
                label="おいかぜ (×2.0)"
                class="pr-2"
                true-value="2"
                false-value="1"
                dense
              />
              <v-checkbox v-model="paralysis" label="まひ (×0.5)" class="pr-2" true-value="5" false-value="10" dense />
              <v-checkbox v-model="swamp" label="湿原 (×0.25)" true-value="25" false-value="100" dense />
            </div>
            <p>オプション</p>
            <v-switch v-model="option" label="±4以上も表示する" dense />
            <v-divider v-if="$vuetify.breakpoint.sm" />
          </div>
        </v-container>
      </v-col>
      <v-col cols="12" md="6" class="d-flex pb-0">
        <v-divider v-if="!$vuetify.breakpoint.sm && !$vuetify.breakpoint.xs" vertical />
        <!-- 素早さのリスト -->
        <v-simple-table style="width: 100%">
          <thead>
            <tr>
              <th class="thead-align-center">ランク</th>
              <th class="thead-align-center">素早さ</th>
            </tr>
          </thead>
          <!-- 浮動小数点数により誤差が生じるのを防ぐため、あらかじめ100倍した数値を引数に渡し、計算後の結果を1/100にして返すようにしている -->
          <tbody align="center">
            <tr v-for="rank in filteredRanks" :key="rank.id">
              <td>{{ formatRank(rank.magnification) }}</td>
              <td>{{ calcBaseSpeed(rank.percent) }} ({{ calcSpeed(rank.percent) }})</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import {
  LOWER_NATURE,
  MAX_EV,
  MAX_REAL_NUMBER,
  RANKS,
  SPEED_ABILITIES,
  SPEED_INDEX,
  SPEED_ITEMS,
  UPPER_NATURE,
} from '@/utils/constants'
import { convertToInteger, numberToInt, updateMeta, valueVerification } from '@/utils/utilities'
import { Nature, PokemonData, Stat } from '~/types'

export default defineComponent({
  setup() {
    updateMeta(
      '素早さ計算機',
      'ポケモンSVに対応している素早さ計算機です。DLC「ゼロの秘宝 - 碧の仮面」に登場する新ポケモンにも対応！ 実数値を入力することで、追い風や麻痺、湿原といったあらゆる状態の素早さをリアルタイムに表示します。すいすいや葉緑素などの特性、スカーフや鉄球といった持ち物を含んだ計算にも対応している、高機能な素早さ計算ツールとなっています。'
    )

    const { store } = useContext()

    const currentNature = computed((): Nature => {
      return store.getters.currentNature
    })

    const currentPokemon = computed((): PokemonData => {
      return store.getters.currentPokemon
    })

    const lv = computed((): number => {
      return store.getters.lv
    })

    const stats = computed((): Stat[] => {
      return store.getters.stats
    })

    const tailwind = ref(1)
    const paralysis = ref(10)
    const swamp = ref(100)
    const option = ref(false)
    const selectItem = ref(10)
    const selectAbility = ref(10)

    const speed = computed(() => {
      return getSpeed()
    })

    const filteredRanks = computed(() => {
      if (option.value) return RANKS
      return RANKS.filter((rank) => Math.abs(rank.magnification) <= 3)
    })

    const formatRank = (magnification: number): string => {
      if (magnification > 0) return `+${magnification}`
      if (magnification === 0) return `±${magnification}`
      return String(magnification)
    }

    /**
     * 実数値を計算して返す
     */
    const getSpeed = (): number => {
      const formatLv = numberToInt(lv.value, 1)
      const individualValue = numberToInt(stats.value[SPEED_INDEX].individualValue)
      const effortValue = numberToInt(stats.value[SPEED_INDEX].effortValue)
      return Math.floor(
        (Math.floor(
          ((currentPokemon.value.stats[SPEED_INDEX] * 2 + individualValue + Math.floor(effortValue / 4)) * formatLv) /
            100
        ) +
          5) *
          currentNature.value.stats[SPEED_INDEX]
      )
    }

    /**
     * 実数値から努力値の逆算を行う
     */
    const setSpeed = (value: string | number) => {
      let setValue = Number(convertToInteger(value, MAX_REAL_NUMBER, false))
      const formatLv = numberToInt(lv.value, 1)
      const individualValue = numberToInt(stats.value[SPEED_INDEX].individualValue)
      const effortValue = numberToInt(stats.value[SPEED_INDEX].effortValue)
      const currentNatureStat = currentNature.value.stats[SPEED_INDEX]
      if (setValue % 11 === 10 && currentNatureStat === UPPER_NATURE) {
        if (
          setValue >=
          Math.floor(
            (Math.floor(
              ((currentPokemon.value.stats[SPEED_INDEX] * 2 + individualValue + Math.floor(effortValue / 4)) *
                formatLv) /
                100
            ) +
              5) *
              currentNatureStat
          )
        ) {
          setValue += 1
        } else {
          setValue -= 1
        }
      }
      if (currentNatureStat === UPPER_NATURE) {
        setValue = Math.ceil(setValue / UPPER_NATURE)
      } else if (currentNatureStat === LOWER_NATURE) {
        setValue = Math.ceil(setValue / LOWER_NATURE)
      }
      setValue =
        (Math.ceil(((setValue - 5) * 100) / formatLv) - currentPokemon.value.stats[SPEED_INDEX] * 2 - individualValue) *
        4
      // 計算した値を代入する
      const verifiedSetValue = valueVerification(setValue, MAX_EV)
      store.commit('updateEffortValue', { value: verifiedSetValue, index: SPEED_INDEX })
    }

    /**
     * 素早さリストに表示する値を計算する
     */
    const calcSpeed = (percent: number) => {
      // 特性が「はやあし・かるわざ」のときは計算の順番を変える
      if (selectAbility.value === 2) {
        return Math.floor(
          (Math.floor((Math.floor((calcBaseSpeed(percent) * selectItem.value) / 10) * paralysis.value) / 10) *
            2 *
            tailwind.value *
            swamp.value) /
            100
        )
        // 特性がその他であれば通常通り計算する
      } else {
        return Math.floor(
          (Math.floor(
            (Math.floor((Math.floor((calcBaseSpeed(percent) * selectAbility.value) / 10) * selectItem.value) / 10) *
              paralysis.value) /
              10
          ) *
            tailwind.value *
            swamp.value) /
            100
        )
      }
    }

    const calcBaseSpeed = (percent: number) => {
      return Math.floor((speed.value * percent) / 100)
    }

    const updateEffortValue = (value: number, index: number) => {
      store.commit('updateEffortValue', { value, index })
    }

    const updateIndividualValue = (value: number, index: number) => {
      store.commit('updateIndividualValue', { value, index })
    }

    return {
      SPEED_ABILITIES,
      SPEED_ITEMS,
      SPEED_INDEX,
      currentPokemon,
      currentNature,
      lv,
      option,
      paralysis,
      selectAbility,
      selectItem,
      speed,
      filteredRanks,
      stats,
      swamp,
      tailwind,
      calcBaseSpeed,
      calcSpeed,
      formatRank,
      setSpeed,
      updateEffortValue,
      updateIndividualValue,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
// Tableのヘッダー部分は、importantで強行しないと左揃えになってしまう
.thead-align-center {
  text-align: center !important;
}
</style>
