<template>
  <v-form ref="formRef" lazy-validation>
    <v-container>
      <v-card max-width="540px" class="mx-auto mt-5">
        <!-- タイトル -->
        <v-card-title>
          <v-card-title class="mx-auto">Pokemonote - {{ title }}</v-card-title>
        </v-card-title>
        <!-- フォームの入力欄 -->
        <v-card-text>
          <slot></slot>
        </v-card-text>
        <!-- ボタン -->
        <v-card-actions>
          <v-btn class="mx-auto px-5" color="info" :disabled="isLoading" large @click="submit">
            {{ buttonText }}
          </v-btn>
        </v-card-actions>
        <!-- エラー文 -->
        <v-list>
          <v-list-item v-for="(error, index) in errors" :key="index">
            <v-list-item-icon>
              <v-icon class="error-message">mdi-alert-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="error-message">{{ error }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

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
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
    errors: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  setup(_, { emit }) {
    const formRef = ref<{ validate: () => boolean }>()
    const submit = () => {
      if (formRef.value!.validate()) {
        emit('submit')
      }
    }
    return {
      formRef,
      submit,
    }
  },
})
</script>

<style lang="scss" scoped>
.error-message {
  color: #d32f2f;
}
</style>
