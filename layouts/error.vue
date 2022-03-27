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

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
    }
  },
  head() {
    const title = this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
