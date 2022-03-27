<template>
  <v-container>
    <v-card flat>
      <!-- タイトル -->
      <v-card-title v-if="error.statusCode === 404">
        {{ pageNotFound }}
      </v-card-title>
      <v-card-title v-else>
        {{ otherError }}
      </v-card-title>
      <v-card-text>お探しのページは見つかりませんでした。</v-card-text>
      <v-card-actions>
        <v-btn text color="primary" to="/" plain nuxt>トップページへ戻る</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { updateMeta } from '~/utils/utilities'

export default defineComponent({
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const pageNotFound = ref('404 Not Found')
    const otherError = ref('An error occurred')

    updateMeta(props.error.statusCode === 404 ? pageNotFound.value : otherError.value)

    return {
      pageNotFound,
      otherError,
    }
  },
  head: {},
})
</script>
