<template lang="pug">
.empty-state
    .empty-state__title(v-if="title") {{ title }}
    .empty-state__message(v-if="message") {{ message }}
</template>

<script>
export default {
  name: 'empty-state',
  props: {
    title: {
      type: String,
      required: true,
      default: ''
    },
    message: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/utilities/_variables";

.empty-state {
  border-radius: 0.25rem;
  border: 1px solid;
  border-color: $borderColor;
  text-align: center;
  padding: 0.5rem;
  margin: 1rem auto;

  &__title {
    color: $fontColor;
    font-weight: bold;
  }

  &__message {
    color: $fontColor;
    font-size: 1rem;
  }
}
</style>


