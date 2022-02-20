<template>
  <div>
    <h1 id="title" class="title font-weight-bold my-2">
      {{ text }}
    </h1>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
  },
})
</script>
