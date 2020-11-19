<template>
  <div class="card-content">
    <h1 class="card-content__title">{{ title }}</h1>
    <p class="card-content__text">{{ text }}</p>
    <AppButton class="card-content__btn" @click="$emit('delete')">delete</AppButton>
  </div>
</template>

<script>
import AppButton from '@/components/ui/AppButton'
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    }
  },
  components: {
    AppButton
  }
}
</script>

<style scoped>
  .card-content__text {
    color: white;
  }

  .card-content__btn {
    width: 100%;
  }
</style>