<template>
  <div class="container">
    <slot name="videos">
      <div class="video-section" v-for="(video, index) in videos" :key="index">
        <video :src="video.url" type="video/mp4"></video>
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    videos: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  width: 100%;
  margin-top: 6px;
  padding: 10px 4px;
}
.video-section {
  width: 100%;
  border: 1px solid #8c999e;
  overflow: hidden;
  border-radius: 6px;
}
</style>
