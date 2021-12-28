<template>
  <v-row>
    <v-col class="text-center">
      <img src="/v.png" alt="Vuetify.js" class="mb-5" />
      <blockquote class="blockquote">
        &#8220;First, solve the problem. Then, write the code.&#8221;
        <footer>
          <small>
            <em>&mdash;John Johnson</em>
          </small>
        </footer>
      </blockquote>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { AuthUserStore } from '@/utils/useAuthUser'
import { AuthUserKey } from '@/utils/useAuthUserKey'

export default defineComponent({
  setup() {
    const text = 'Hello, World!'

    const { getAuthUser } = inject(AuthUserKey) as AuthUserStore

    return {
      getAuthUser,
      text,
    }
  },
  head: {
    title: 'my page222',
    meta: [
      {
        name: 'description',
        content: '説明です',
      },
      {
        name: 'twitter:description',
        content: '説明ですね',
      },
      {
        property: 'og:description',
        content: '説明ですね',
      },
    ],
  },
})
</script>
