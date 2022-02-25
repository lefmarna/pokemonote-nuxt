<template>
  <v-col class="d-flex justify-center">
    <div>
      <!-- 努力値が自動更新されることによって実数値の入力を妨げてしまうため、実数値はinputではなくchangeで発火させている
                  なお、Vuetifyではv-modelのlazy修飾子をサポートしていないため、:valueと@changeで分けて書く必要がある -->
      <v-text-field
        ref="realNumberRef"
        type="tel"
        :label="stats[statsIndex].name"
        :value="realNumber"
        persistent-placeholder
        @click="realNumberRef.$refs.input.select()"
        @change="updateRealNumber($event, statsIndex)"
      />
    </div>
    <div>
      <CalcButton
        button-text="▲"
        class="mb-1 btn-min-xs"
        @click.native="updateRealNumber(realNumber + 1, statsIndex)"
      />
      <br />
      <CalcButton button-text="▼" class="btn-min-xs" @click.native="updateRealNumber(realNumber - 1, statsIndex)" />
    </div>
  </v-col>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '@nuxtjs/composition-api'
import { VTextField, Stat } from '@/types'

export default defineComponent({
  props: {
    realNumber: {
      type: Number,
      required: true,
    },
    stats: {
      type: [] as PropType<Stat[]>,
      required: true,
    },
    statsIndex: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const realNumberRef = ref<VTextField>()

    const updateRealNumber = (event: string | number, index: number): void => {
      if (realNumberRef.value === undefined) return

      emit('updateRealNumber', event, index)
      realNumberRef.value.lazyValue = props.realNumber
    }

    return {
      realNumberRef,
      updateRealNumber,
    }
  },
})
</script>
