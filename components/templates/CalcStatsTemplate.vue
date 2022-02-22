<template>
  <v-container>
    <Title :text="title" />
    <v-row>
      <!-- 左ここから -->
      <v-col cols="12" md="6" class="d-flex">
        <v-container :class="$vuetify.breakpoint.xs ? 'px-0' : ''">
          <StatsTableHeader
            :current-pokemon="currentPokemon"
            :current-nature="currentNature"
            :lv="lv"
            @updatePokemon="$emit('update:currentPokemon', $event)"
            @updateNature="$emit('update:currentNature', $event)"
            @updateLv="$emit('update:lv', $event)"
          />
          <!-- ステータス一覧 -->
          <div class="statsTable">
            <v-row v-for="(stat, index) in stats" :key="stat.name">
              <!-- 種族値 -->
              <BaseStatsField
                :base-stat="currentPokemon.stats[index]"
                :stats-initial="stat.initial"
                :nature-stat="currentNature.stats[index]"
              />
              <!-- 個体値 -->
              <IndividualValueField
                :stats="stats"
                :stats-index="index"
                @updateIndividualValue="$emit('updateIndividualValue', $event, index)"
              />
              <!-- 努力値 -->
              <EffortValueField
                :stats="stats"
                :stats-index="index"
                @updateEffortValue="$emit('updateEffortValue', $event, index)"
              />
              <!-- 実数値 -->
              <RealNumberField
                :real-number="realNumbers[index]"
                :stats="stats"
                :stats-index="index"
                @updateRealNumber="updateRealNumber"
              />
            </v-row>
            <v-row class="font-weight-bold">
              <v-col cols="2" class="d-flex justify-center">
                <p class="mb-0">{{ totalBaseStats }}</p>
              </v-col>
              <v-col cols="3" class="d-flex justify-center">
                <span class="pr-1">{{ totalIv }}</span>
              </v-col>
              <v-col class="d-flex justify-center">
                <span class="pr-1" :class="totalEvCheck">{{ totalEv }}</span
                >/&nbsp;{{ MAX_TOTAL_EV }}
              </v-col>
              <v-col class="d-flex justify-center">
                {{ totalStats }}
              </v-col>
            </v-row>
          </div>
        </v-container>
      </v-col>
      <!-- 左ここまで -->
      <!-- 右ここから -->
      <v-col cols="12" md="6" class="d-flex">
        <v-container :class="$vuetify.breakpoint.xs ? 'pa-0' : ''">
          <v-row>
            <v-col cols="6">
              <v-card height="100%" shaped>
                <v-card-title>耐久指数</v-card-title>
                <v-card-text>
                  <p class="mb-2">総合：{{ physicalDurability + specialDurability }}</p>
                  <p class="mb-2">物理：{{ physicalDurability }}</p>
                  <p class="mb-0">特殊：{{ specialDurability }}</p>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card height="100%" shaped>
                <v-card-title>その他</v-card-title>
                <v-card-text>めざパ：{{ hiddenPower }} </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <!-- 耐久調整-->
          <v-row class="pb-2" align="start">
            <v-col cols="12">
              <v-card shaped>
                <v-card-title>耐久調整</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="6" class="pb-0" align="center">
                      <v-card-subtitle class="pa-0">倍率</v-card-subtitle>
                      <v-select
                        v-model="selectDefenceEnhancement"
                        :items="DEFENCE_ENHANCEMENTS"
                        item-text="name"
                        item-value="value"
                        label="防御"
                      ></v-select>
                      <v-select
                        v-model="selectSpDefenceEnhancement"
                        :items="SP_DEFENCE_ENHANCEMENTS"
                        item-text="name"
                        item-value="value"
                        label="特防"
                      ></v-select>
                    </v-col>
                    <v-col cols="6" class="pb-0" align="center">
                      <v-card-subtitle class="pa-0">計算スタイル</v-card-subtitle>
                      <v-radio-group v-model="calcStyle">
                        <v-radio label="バランス - HBD/(B+D)" value="balance"></v-radio>
                        <v-radio label="総合耐久 - H=B+D" value="performance" disabled></v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-row class="mb-0">
                    <v-col cols="12" align="center">
                      <v-btn color="primary" elevation="2" outlined large @click.native="durabilityAdjustment"
                        >耐久調整を計算する</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <!-- ポケモンの説明 -->
          <v-row>
            <v-col class="py-0">
              <v-textarea
                v-model="description"
                outlined
                rows="5"
                shaped
                placeholder="ポケモンの説明（例：○○の××確定耐え）"
              ></v-textarea>
            </v-col>
          </v-row>
          <!-- 「努力値リセット」と「投稿する」のボタン -->
          <v-row class="pb-2" align-content="center">
            <v-col class="text-center">
              <v-btn color="danger" elevation="2" outlined large @click.native="resetEffortValue">努力値リセット</v-btn>
            </v-col>
            <v-col class="text-center">
              <v-btn color="primary" elevation="3" :disabled="!$store.getters.isLogin" large @click="emitPokemon">{{
                buttonText
              }}</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent, ref, PropType } from '@nuxtjs/composition-api'
import { convertToHalfWidthInteger, numberToInt, valueVerification } from '@/utils/utilities'
import {
  ATTACK_INDEX,
  DEFENCE_ENHANCEMENTS,
  DEFENCE_INDEX,
  HP_INDEX,
  LOWER_NATURE,
  MAX_EV,
  MAX_REAL_NUMBER,
  MAX_TOTAL_EV,
  MIN_LEVEL,
  SPEED_INDEX,
  SP_ATTACK_INDEX,
  SP_DEFENCE_ENHANCEMENTS,
  SP_DEFENCE_INDEX,
  UPPER_NATURE,
} from '@/utils/constants'
import { Nature, PokemonData, Stat } from '@/types/index'

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      required: true,
    },
    currentPokemon: {
      type: Object as PropType<PokemonData>,
      required: true,
    },
    currentNature: {
      type: Object as PropType<Nature>,
      required: true,
    },
    lv: {
      type: Number,
      required: false,
      default: null,
    },
    stats: {
      type: [] as PropType<Stat[]>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const selectDefenceEnhancement = ref(1)
    const selectSpDefenceEnhancement = ref(1)
    const calcStyle = ref('balance')
    const description = ref('')

    const totalStats = computed(() => {
      return (
        realNumbers.value[HP_INDEX] +
        realNumbers.value[ATTACK_INDEX] +
        realNumbers.value[DEFENCE_INDEX] +
        realNumbers.value[SP_ATTACK_INDEX] +
        realNumbers.value[SP_DEFENCE_INDEX] +
        realNumbers.value[SPEED_INDEX]
      )
    })

    // 種族値の合計値を計算する
    const totalBaseStats = computed(() => {
      return Object.values(props.currentPokemon.stats).reduce((sum, stat) => {
        sum += stat
        return sum
      }, 0)
    })

    // 個体値の合計値を計算する
    const totalIv = computed(() => {
      return props.stats.reduce((sum, stat) => {
        sum += numberToInt(stat.individualValue)
        return sum
      }, 0)
    })

    // 努力値の合計値を計算する
    const totalEv = computed(() => {
      return props.stats.reduce((sum, stat) => {
        sum += numberToInt(stat.effortValue)
        return sum
      }, 0)
    })

    // 努力値の合計が最大値より大きい場合は警告を出す
    const totalEvCheck = computed(() => {
      if (totalEv.value > MAX_TOTAL_EV) return 'text-danger'
      return ''
    })

    // 物理耐久指数を求める
    const physicalDurability = computed(() => {
      return realNumbers.value[HP_INDEX] * Math.floor(realNumbers.value[DEFENCE_INDEX] * selectDefenceEnhancement.value)
    })

    // 特殊耐久指数を求める
    const specialDurability = computed(() => {
      return (
        realNumbers.value[HP_INDEX] * Math.floor(realNumbers.value[SP_DEFENCE_INDEX] * selectSpDefenceEnhancement.value)
      )
    })

    // めざめるパワーのタイプを求める
    const hiddenPower = computed(() => {
      let hiddenPowerCalc = 0
      for (let i = 0, len = props.stats.length; i < len; i++) {
        if (Number(props.stats[i].individualValue) % 2 === 1) {
          // めざパの計算では特攻の前に素早さを持ってくる必要があるため、とりあえずif文で対応した（配列の順番を変えてからまとめて処理するのもありかもしれない）
          if (i === SPEED_INDEX) {
            hiddenPowerCalc += 8
          } else if (i > 2) {
            hiddenPowerCalc += 2 ** (1 + i)
          } else {
            hiddenPowerCalc += 2 ** i
          }
        }
      }
      hiddenPowerCalc = Math.floor((hiddenPowerCalc * 15) / 63)
      switch (hiddenPowerCalc) {
        case 0:
          return 'かくとう'
        case 1:
          return 'ひこう'
        case 2:
          return 'どく'
        case 3:
          return 'じめん'
        case 4:
          return 'いわ'
        case 5:
          return 'むし'
        case 6:
          return 'ゴースト'
        case 7:
          return 'はがね'
        case 8:
          return 'ほのお'
        case 9:
          return 'みず'
        case 10:
          return 'くさ'
        case 11:
          return 'でんき'
        case 12:
          return 'エスパー'
        case 13:
          return 'こおり'
        case 14:
          return 'ドラゴン'
        default:
          return 'あく'
      }
    })

    // 実数値を計算して返す
    const getStat = (index: number, tmpEV = 0): number => {
      const formatLv = numberToInt(Number(props.lv), 1)
      const formatIndividualValue = numberToInt(props.stats[index].individualValue)
      let formatEffortValue = 0
      // 耐久調整ボタンから呼び出した場合は、仮の努力値を代入する
      if (tmpEV) {
        formatEffortValue = tmpEV
      } else {
        formatEffortValue = numberToInt(props.stats[index].effortValue)
      }
      if (index === HP_INDEX) {
        if (props.currentPokemon.name === 'ヌケニン') return 1
        return (
          Math.floor(
            ((props.currentPokemon.stats[index] * 2 + formatIndividualValue + Math.floor(formatEffortValue / 4)) *
              formatLv) /
              100
          ) +
          10 +
          formatLv
        )
      } else {
        return Math.floor(
          (Math.floor(
            ((props.currentPokemon.stats[index] * 2 + formatIndividualValue + Math.floor(formatEffortValue / 4)) *
              formatLv) /
              100
          ) +
            5) *
            props.currentNature.stats[index]
        )
      }
    }

    // 実数値から努力値の逆算を行う
    const updateRealNumber = (value: string | number, index: number): void => {
      let setValue = Number(convertToHalfWidthInteger(value, MAX_REAL_NUMBER, false))
      const formatLv = numberToInt(props.lv, MIN_LEVEL)
      const formatIndividualValue = numberToInt(props.stats[index].individualValue)
      // HPのみ計算式が異なる
      if (index === HP_INDEX) {
        setValue =
          (Math.ceil(((setValue - formatLv - 10) * 100) / formatLv) -
            props.currentPokemon.stats[index] * 2 -
            formatIndividualValue) *
          4
        // HP以外の計算では、性格補正を修正してから努力値の逆算を行う必要がある
      } else {
        const effortValue = numberToInt(props.stats[index].effortValue)
        const currentNatureStat = props.currentNature.stats[index]
        if (setValue % 11 === 10 && currentNatureStat === UPPER_NATURE) {
          if (
            setValue >=
            Math.floor(
              (Math.floor(
                ((props.currentPokemon.stats[index] * 2 + formatIndividualValue + Math.floor(effortValue / 4)) *
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
          (Math.ceil(((setValue - 5) * 100) / formatLv) -
            props.currentPokemon.stats[index] * 2 -
            formatIndividualValue) *
          4
      }
      // 【共通の処理】計算した値を代入する
      const verifiedSetValue = valueVerification(setValue, MAX_EV)
      emit('updateEffortValue', { value: verifiedSetValue, index })
    }

    // 努力値をリセットする
    const resetEffortValue = (): void => {
      props.stats.forEach((stat) => {
        stat.effortValue = null
      })
    }

    // 理想の耐久調整を自動で計算する関数
    const durabilityAdjustment = (): void => {
      // 攻撃、特攻、素早さの努力値を除いた値を求める
      const remainderEffortValue =
        MAX_TOTAL_EV -
        Number(props.stats[1].effortValue) -
        Number(props.stats[3].effortValue) -
        Number(props.stats[5].effortValue)

      // 計算に使う努力値を一時的に格納しておくための変数
      let tmpHpEV = remainderEffortValue // HPから順に計算していくので、最初に余りの努力値をそのまま代入している
      let tmpDefenceEV = 0
      let tmpSpDefenceEV = 0

      // 計算に使う実数値を一時的に格納しておくための変数
      let tmpHp = 0
      let tmpDefence = 0
      let tmpSpDefence = 0

      // 実数値の計算は耐久補正込で行うが、代入する際には元の値を使うため、別の変数を用意することにした
      let tmpDefenceEnhancement = 0
      let tmpSpDefenceEnhancement = 0

      // 最終的に代入することになる実数値を格納しておくための変数
      let resultHp = 0
      let resultDefence = 0
      let resultSpDefence = 0

      // 計算された耐久指数を比較していくのに用いる変数
      let oldHBD = 0
      let newHBD = 0

      // TODO: HBDの努力値を一度リセットする(不要な処理のような気もするが、これを記載しないと努力値の合計が最大値を超えてしまうことがある)
      // props.stats[HP_INDEX].effortValue = 0
      // props.stats[DEFENCE_INDEX].effortValue = 0
      // props.stats[SP_DEFENCE_INDEX].effortValue = 0

      // 努力値の余りが最大値より大きかった場合、スタートであるHPの仮努力値を最大値とする
      if (tmpHpEV > MAX_EV) tmpHpEV = MAX_EV

      // HP→特防→防御の順に総当たりで計算していく
      while (tmpHpEV >= 0) {
        tmpHp = getStat(HP_INDEX, tmpHpEV) // HPの努力値からHPの実数値を計算
        tmpSpDefenceEV = remainderEffortValue - tmpHpEV
        if (tmpSpDefenceEV > MAX_EV) {
          tmpSpDefenceEV = MAX_EV
        }
        // 防御より先に特防を計算することで、端数が出た場合に特防に割り振られるようになる(ダウンロード対策でB<Dのほうが好まれることから、このような仕様にしている)
        while (tmpSpDefenceEV >= 0) {
          tmpSpDefence = getStat(SP_DEFENCE_INDEX, tmpSpDefenceEV) // 特防の努力値から特防の実数値を計算
          tmpDefenceEV = remainderEffortValue - tmpHpEV - tmpSpDefenceEV
          // 防御の仮努力値が最大値を超えてしまう場合には値を更新しない
          if (tmpDefenceEV > MAX_EV) break

          tmpDefence = getStat(DEFENCE_INDEX, tmpDefenceEV) // 防御の努力値から防御の実数値を計算

          // 耐久補正込での耐久値を求める
          tmpDefenceEnhancement = Math.floor(tmpDefence * selectDefenceEnhancement.value)
          tmpSpDefenceEnhancement = Math.floor(tmpSpDefence * selectSpDefenceEnhancement.value)

          // 耐久指数を計算する
          newHBD =
            (tmpHp * tmpDefenceEnhancement * tmpSpDefenceEnhancement) /
            (tmpDefenceEnhancement + tmpSpDefenceEnhancement)
          // 耐久指数が前回のものより大きければ更新、そうでなければ更新しない
          if (oldHBD < newHBD) {
            oldHBD = newHBD
            resultHp = tmpHp
            resultDefence = tmpDefence
            resultSpDefence = tmpSpDefence
          }
          tmpSpDefenceEV--
        }
        tmpHpEV--
      }
      // 最も優秀だった結果を代入する
      updateRealNumber(resultHp, HP_INDEX)
      updateRealNumber(resultDefence, DEFENCE_INDEX)
      updateRealNumber(resultSpDefence, SP_DEFENCE_INDEX)
    }

    // ポケモンのデータを親に渡す
    const emitPokemon = (): void => {
      const params = {
        name: props.currentPokemon.name,
        nature: props.currentNature.name,
        lv: props.lv,
        hp_iv: props.stats[HP_INDEX].individualValue,
        hp_ev: props.stats[HP_INDEX].effortValue,
        hp: realNumbers.value[HP_INDEX],
        attack_iv: props.stats[ATTACK_INDEX].individualValue,
        attack_ev: props.stats[ATTACK_INDEX].effortValue,
        attack: realNumbers.value[ATTACK_INDEX],
        defence_iv: props.stats[DEFENCE_INDEX].individualValue,
        defence_ev: props.stats[DEFENCE_INDEX].effortValue,
        defence: realNumbers.value[DEFENCE_INDEX],
        sp_attack_iv: props.stats[SP_ATTACK_INDEX].individualValue,
        sp_attack_ev: props.stats[SP_ATTACK_INDEX].effortValue,
        sp_attack: realNumbers.value[SP_ATTACK_INDEX],
        sp_defence_iv: props.stats[SP_DEFENCE_INDEX].individualValue,
        sp_defence_ev: props.stats[SP_DEFENCE_INDEX].effortValue,
        sp_defence: realNumbers.value[SP_DEFENCE_INDEX],
        speed_iv: props.stats[SPEED_INDEX].individualValue,
        speed_ev: props.stats[SPEED_INDEX].effortValue,
        speed: realNumbers.value[SPEED_INDEX],
        description: description.value,
        is_public: 1,
      }
      emit('submit', params)
    }

    /**
     * 実数値は努力値の更新による自動計算によって求めるため、直接代入してはいけない。
     */
    const realNumbers = computed(() => {
      return [
        getStat(HP_INDEX),
        getStat(ATTACK_INDEX),
        getStat(DEFENCE_INDEX),
        getStat(SP_ATTACK_INDEX),
        getStat(SP_DEFENCE_INDEX),
        getStat(SPEED_INDEX),
      ]
    })

    return {
      DEFENCE_ENHANCEMENTS,
      MAX_TOTAL_EV,
      SP_DEFENCE_ENHANCEMENTS,
      calcStyle,
      description,
      hiddenPower,
      physicalDurability,
      realNumbers,
      selectDefenceEnhancement,
      selectSpDefenceEnhancement,
      specialDurability,
      totalBaseStats,
      totalEvCheck,
      totalEv,
      totalIv,
      totalStats,
      durabilityAdjustment,
      emitPokemon,
      updateRealNumber,
      resetEffortValue,
    }
  },
})
</script>
