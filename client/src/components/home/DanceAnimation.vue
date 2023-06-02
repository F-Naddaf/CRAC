<template>
  <div>
    <img
      class="dance-image"
      src="../../../public/img/dance-1.png"
      alt="dance-lady-1"
    />
    <img
      class="dance-image"
      src="../../../public/img/dance-2.png"
      alt="dance-lady-2"
    />
    <img
      class="dance-image"
      src="../../../public/img/dance-3.png"
      alt="dance-lady-3"
    />
    <img
      class="dance-image"
      src="../../../public/img/dance-4.png"
      alt="dance-lady-4"
    />
    <img
      class="dance-image"
      src="../../../public/img/dance-5.png"
      alt="dance-lady-5"
    />
    <img
      class="dance-image"
      src="../../../public/img/dance-6.png"
      alt="dance-lady-6"
    />
  </div>
</template>

<script>
export default {
  name: "DanceAnimation",
};
</script>

<style scoped>
.dance-image {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  animation-name: dance-animation;
  animation-duration: 6s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  filter: brightness(70%);
}

.dance-image:nth-child(1) {
  animation-delay: 0s;
}

.dance-image:nth-child(2) {
  animation-delay: 1s;
}

.dance-image:nth-child(3) {
  animation-delay: 2s;
}

.dance-image:nth-child(4) {
  animation-delay: 3s;
}

.dance-image:nth-child(5) {
  animation-delay: 4s;
}

.dance-image:nth-child(6) {
  animation-delay: 5s;
}

@keyframes dance-animation {
  0% {
    opacity: 0;
  }
  16.67% {
    opacity: 1;
  }
  33.33% {
    opacity: 0;
  }
}
</style>
