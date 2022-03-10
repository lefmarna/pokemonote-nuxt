<template>
  <div class="d-flex">
    <div>
      <v-text-field
        ref="lvRef"
        type="tel"
        label="レベル"
        :placeholder="String(MIN_LEVEL)"
        :value="lv"
        persistent-placeholder
        @click="lvRef.$refs.input.select()"
        @input="updateLv($event)"
      />
    </div>
    <div>
      <CalcButton :button-text="String(MAX_LEVEL)" class="mb-1 btn-min-sm" @click.native="$emit('update', MAX_LEVEL)" />
      <br />
      <CalcButton
        :button-text="String(DEFAULT_LEVEL)"
        class="btn-min-sm"
        @click.native="$emit('update', DEFAULT_LEVEL)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { convertToInteger } from '@/utils/utilities'
import { DEFAULT_LEVEL, MAX_LEVEL, MIN_LEVEL } from '@/utils/constants'
import { VTextField } from '@/types'

export default defineComponent({
  props: {
    lv: {
      type: Number,
      required: false,
      default: null,
    },
  },
  setup(_, { emit }) {
    const lvRef = ref<VTextField>()

    const updateLv = (value: string) => {
      if (lvRef.value === undefined) return
      const formatValue = convertToInteger(value, MAX_LEVEL, false)

      // lazyValueはVuetifyでinputタグの中身の値を示す、ここに直接代入することでリアクティブに入力を更新することができる
      lvRef.value.lazyValue = formatValue
      emit('update', formatValue)
    }

    return {
      lvRef,
      updateLv,
      DEFAULT_LEVEL,
      MAX_LEVEL,
      MIN_LEVEL,
    }
  },
})
</script>
