<template>
  <div class="carousel">
    <slot :currentSlide="currentSlide"></slot>
    <div class="navigate"></div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const currentSlide = ref(0);
    return {
      currentSlide,
    };
  },
};
</script>

<style></style>
