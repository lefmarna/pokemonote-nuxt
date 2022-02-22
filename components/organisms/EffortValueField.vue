<template>
  <v-col class="d-flex justify-center">
    <div>
      <v-text-field
        ref="effortValueRef"
        type="tel"
        label="努力値"
        placeholder="0"
        :value="stats[statsIndex].effortValue"
        persistent-placeholder
        @input="updateEffortValue($event, statsIndex)"
      />
    </div>
    <div>
      <CalcButton
        :button-text="String(MAX_EV)"
        class="mb-1 btn-min-sm"
        @click.native="updateEffortValue(MAX_EV, statsIndex)"
      />
      <br />
      <CalcButton button-text="0" class="btn-min-sm" @click.native="updateEffortValue(null, statsIndex)" />
    </div>
  </v-col>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '@nuxtjs/composition-api'
import { LazyValue, Stat } from '@/types'
import { convertToHalfWidthInteger } from '@/utils/utilities'
import { MAX_EV } from '@/utils/constants'

export default defineComponent({
  props: {
    stats: {
      type: [] as PropType<Stat[]>,
      required: true,
    },
    statsIndex: {
      type: Number,
      required: true,
    },
  },
  setup(_, { emit }) {
    const effortValueRef = ref<LazyValue>()

    const updateEffortValue = (value: string | number, index: number): void => {
      if (effortValueRef.value === undefined) return

      const formatValue = convertToHalfWidthInteger(value, MAX_EV)
      effortValueRef.value.lazyValue = formatValue
      emit('updateEffortValue', formatValue, index)
    }

    return {
      MAX_EV,
      effortValueRef,
      updateEffortValue,
    }
  },
})
</script>
