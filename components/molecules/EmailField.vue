<template>
  <v-text-field
    :name="name"
    :label="label"
    prepend-icon="mdi-email"
    type="email"
    :rules="[rules.required, rules.email]"
    :value="email"
    @input="$emit('update:email', $event)"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { emailValidation } from '@/utils/regex'

export default defineComponent({
  props: {
    email: {
      type: String,
      required: false,
      default: '',
    },
    label: {
      type: String,
      required: false,
      default: 'メールアドレス',
    },
    name: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup() {
    const rules = computed(() => {
      return {
        required: (value: string) => !!value || 'この項目は必須です',
        email: (value: string) => {
          return emailValidation.test(value) || 'メールアドレスは有効ではありません'
        },
      }
    })
    return {
      rules,
    }
  },
})
</script>
