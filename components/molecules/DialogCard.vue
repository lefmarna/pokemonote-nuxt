<template>
  <v-dialog v-model="dialog" max-width="540">
    <template #activator="{ on, attrs }">
      <slot name="activator" :attrs="attrs" :on="on"></slot>
    </template>
    <v-card class="pt-1 pb-3">
      <v-card-title class="justify-center">{{ title }}</v-card-title>
      <slot name="content"></slot>
      <v-card-actions class="justify-space-around">
        <v-btn color="secondary" outlined min-width="125" depressed @click="dialog = false">{{
          cancelButtonText
        }}</v-btn>
        <v-btn :color="submitButtonColor" min-width="125" depressed @click="$emit('submit')">{{
          submitButtonText
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    cancelButtonText: {
      type: String,
      required: false,
      default: 'キャンセル',
    },
    submitButtonText: {
      type: String,
      required: true,
    },
    isDanger: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const dialog = ref(false)

    const submitButtonColor = computed(() => {
      if (props.isDanger) return 'danger white--text'
      return 'info'
    })

    return {
      dialog,
      submitButtonColor,
    }
  },
})
</script>
