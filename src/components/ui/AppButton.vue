<template>
  <button :class="['app-btn', `app-btn_size_${size}`]" @click="$emit('click')">
    <slot/>
  </button>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: 'default'
    }
  }
}
</script>

<style scoped>
  .app-btn {

  }

  .app-btn_size_l {
    min-width: 90px;
    min-height: 90px;
  }
</style>