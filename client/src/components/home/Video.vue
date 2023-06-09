<template>
  <div
    class="relative w-full h-full">
    <div class="error-container">
      <p v-if="showError" class="text-sm text-gray-200">
        {{ error }}
      </p>
    </div>
    <video loop autoplay class="video" :data-index="index">
      <source class="source" :src="video.url" type="video/mp4" />
    </video>
    <div class="absolute bottom-4 left-4">
      <p
        class="text-base text-primary-200"
        style="text-shadow: 0.5px 0.5px #262626"
      >
        #{{ video.username }}
      </p>
      <p
        class="text-sm text-label -mt-1 ml-2"
        style="text-shadow: 0.5px 0.5px #262626"
      >
        {{ video.title }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Video",
};
</script>

<style></style>
