<template>
  <div class="container">
    <!-- <slot name="videos"> -->
      <button
        class="video-section"
        v-for="(video, index) in videos"
        :key="index"
        @mouseover="playVideo(index)"
        @mouseout="pauseVideo(index)"
      >
        <i class="fa-solid fa-play"></i>
        <video :src="video.url" type="video/mp4" ref="videos"></video>
      </button>
    <!-- </slot> -->
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
  methods: {
    playVideo(index) {
      const videoElement = this.$refs.videos[index];
      if (
        !videoElement.currentTime ||
        videoElement.paused ||
        videoElement.ended
      ) {
        setTimeout(() => {
          videoElement.play().catch((error) => {
            console.error("Failed to play video:", error);
          });
        }, 10);
      }
    },
    pauseVideo(index) {
      const videoElement = this.$refs.videos[index];
      if (!videoElement.paused && !videoElement.ended) {
        videoElement.pause();
        videoElement.currentTime = 0;
      }
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
  position: relative;
  border: 1px solid #8c999e;
  overflow: hidden;
  border-radius: 6px;
}
.video-section i {
  position: absolute;
  bottom: 3px;
  right: 3px;
  font-size: 12px;
  color: #28bfd2;
  opacity: 0;
  transition: opacity 0.3s;
}
.video-section:hover i {
  opacity: 1;
}
</style>
