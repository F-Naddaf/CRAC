<template>
  <div class="container">
    <button
      class="video-section"
      v-for="(video, index) in videos"
      :key="index"
      @mouseover="playVideo(index)"
      @mouseout="pauseVideo(index)"
      @click="openVideo(video._id)"
    >
      <i class="fa-solid fa-play"></i>
      <video
        :src="video.url"
        type="video/mp4"
        :ref="(el) => (videoRefs[index] = el)"
      ></video>
    </button>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  props: {
    videos: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const videoRefs = ref([]);
    const router = useRouter();

    const playVideo = (index) => {
      const videoElement = videoRefs.value[index];
      if (videoElement && videoElement.readyState === 4) {
        videoElement.play().catch((error) => {
          console.error("Failed to play video:", error);
        });
      }
    };

    const pauseVideo = (index) => {
      const videoElement = videoRefs.value[index];
      if (videoElement && !videoElement.paused && !videoElement.ended) {
        videoElement.pause();
        videoElement.currentTime = 0;
      }
    };

    const openVideo = (videoId) => {
      router.push({
        name: "ViewVideo",
        params: { id: videoId },
      });
    };

    return {
      videoRefs,
      playVideo,
      pauseVideo,
      openVideo,
    };
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
