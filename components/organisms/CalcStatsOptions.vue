<template>
  <v-container style="background-color: white">
    <v-row>
      <v-col cols="6">
        <v-card rounded="xl" height="100%" outlined>
          <v-card-title>耐久指数</v-card-title>
          <v-card-text>
            <p class="mb-2">
              総合：{{ physicalDurability + specialDurability }}<br />
              物理：{{ physicalDurability }}<br />
              特殊：{{ specialDurability }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card height="100%" rounded="xl" outlined>
          <v-card-title>その他</v-card-title>
          <v-card-text>めざパ：{{ hiddenPower }} </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- 耐久調整-->
    <v-row align="start">
      <v-col cols="12">
        <v-card rounded="xl" outlined>
          <v-card-title class="justify-center">耐久調整</v-card-title>
          <v-card-text>最も理想的な配分で、余りの努力値をHBDに振り分けます。</v-card-text>
          <v-row>
            <v-col cols="4" class="pb-0" align="center">
              <v-card max-width="125" min-width="89" flat>
                <v-card-subtitle class="pa-0">倍率</v-card-subtitle>
                <v-card-text>
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
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="8" class="pb-0" align="center">
              <v-card max-width="250" flat>
                <v-card-subtitle class="pa-0">計算スタイル</v-card-subtitle>
                <v-radio-group v-model="calcStyle">
                  <v-radio label="バランス - HBD/(B+D)" value="balance" />
                  <v-radio label="総合耐久 - H=B+D" value="performance" />
                </v-radio-group>
              </v-card>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-row class="mb-0">
              <v-col cols="12" align="center">
                <v-btn
                  color="primary"
                  elevation="2"
                  outlined
                  large
                  @click.native="$emit('durabilityAdjustment', calcStyle)"
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
      <v-col>
        <v-textarea
          :value="description"
          outlined
          rows="5"
          hide-details
          no-resize
          placeholder="ポケモンの説明（例：○○の××確定耐え）"
          @input="$emit('updateDescription', $event)"
        ></v-textarea>
      </v-col>
    </v-row>
    <!-- 「努力値リセット」と「投稿する」のボタン -->
    <v-row class="pb-2 d-none d-md-flex" align-content="center">
      <v-col class="text-center">
        <v-btn color="danger" elevation="2" outlined large @click.native="resetEffortValue">努力値リセット</v-btn>
      </v-col>
      <v-col class="text-center">
        <v-btn color="primary" elevation="3" :disabled="!$store.getters.isLogin" large @click="$emit('emitPokemon')">{{
          buttonText
        }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from '@vue/composition-api'
import { Stat } from '~/types'
import {
  DEFENCE_ENHANCEMENTS,
  DEFENCE_INDEX,
  HP_INDEX,
  SPEED_INDEX,
  SP_DEFENCE_ENHANCEMENTS,
  SP_DEFENCE_INDEX,
  STATS_LENGTH,
} from '~/utils/constants'

export default defineComponent({
  props: {
    buttonText: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    realNumbers: {
      type: [] as PropType<number[]>,
      required: true,
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

    // 物理耐久指数を求める
    const physicalDurability = computed(() => {
      return props.realNumbers[HP_INDEX] * Math.floor(props.realNumbers[DEFENCE_INDEX] * selectDefenceEnhancement.value)
    })

    // 特殊耐久指数を求める
    const specialDurability = computed(() => {
      return (
        props.realNumbers[HP_INDEX] * Math.floor(props.realNumbers[SP_DEFENCE_INDEX] * selectSpDefenceEnhancement.value)
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

    // 努力値をリセットする
    const resetEffortValue = (): void => {
      for (let i = 0; i < STATS_LENGTH; i++) {
        emit('updateEffortValue', null, i)
      }
    }

    return {
      DEFENCE_ENHANCEMENTS,
      SP_DEFENCE_ENHANCEMENTS,
      calcStyle,
      hiddenPower,
      physicalDurability,
      selectDefenceEnhancement,
      selectSpDefenceEnhancement,
      specialDurability,
      resetEffortValue,
    }
  },
})
</script>
