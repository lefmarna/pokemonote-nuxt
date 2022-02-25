<template>
  <v-col class="d-flex justify-center">
    <div>
      <v-text-field
        ref="individualValueRef"
        type="tel"
        label="個体値"
        placeholder="0"
        :value="stats[statsIndex].individualValue"
        persistent-placeholder
        @click="individualValueRef.$refs.input.select()"
        @input="updateIndividualValue($event, statsIndex)"
      />
    </div>
    <div>
      <CalcButton
        :button-text="String(MAX_IV)"
        class="mb-1 btn-min-xs"
        @click.native="updateIndividualValue(MAX_IV, statsIndex)"
      />
      <br />
      <CalcButton button-text="0" class="btn-min-xs" @click.native="updateIndividualValue(null, statsIndex)" />
    </div>
  </v-col>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '@nuxtjs/composition-api'
import { VTextField, Stat } from '@/types'
import { convertToHalfWidthInteger } from '@/utils/utilities'
import { MAX_IV } from '@/utils/constants'

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
    const individualValueRef = ref<VTextField>()

    const updateIndividualValue = (value: string | number, index: number): void => {
      if (individualValueRef.value === undefined) return

      const formatValue = convertToHalfWidthInteger(String(value), MAX_IV)
      individualValueRef.value.lazyValue = formatValue
      emit('updateIndividualValue', formatValue, index)
    }

    return {
      MAX_IV,
      individualValueRef,
      updateIndividualValue,
    }
  },
})
</script>
