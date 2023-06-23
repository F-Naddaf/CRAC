<template>
  <div class="video-card-container">
    <router-link
      v-for="video in videos"
      :key="video._id"
      :to="`/view-video/${video._id}/${video.userId}`"
    >
      <video loop autoplay class="video" ref="vidRef">
        <source class="source" :src="video.url" type="video/mp4" />
      </video>
      <p v-if="video.title.length > 45" class="text-xs text-primary-200 pl-2">
        {{ video.title.slice(0, 16) + "..." }}
      </p>
      <p v-else class="text-xs text-primary-200 pl-2">{{ video.title }}</p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "VideoCard",
  props: {
    videos: Array,
  },
};
</script>

<style scoped>
.video-card-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, 1fr);
  height: 100%;
  width: 100%;
  gap: 10px;
  padding: 0 10px;
  margin-top: 20px;
  overflow: auto;
}
.video {
  border: 1px solid #28bfd2;
  border-radius: 10px;
}
.video-card-container::-webkit-scrollbar {
  display: none;
}
</style>
