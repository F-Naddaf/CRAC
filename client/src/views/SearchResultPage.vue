<template>
  <div class="flex justify-center w-full h-screen relative overflow-hidden">
    <div v-if="isLoading" class="mt-20">
      <img src="../../public/img/spinner.svg" alt="loading" />
    </div>
    <div v-else class="video-wrapper">
      <VideoCard :videos="videos" />
    </div>
    <NavBar />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import HomeHeader from "@/components/home/HomeHeader.vue";
import VideoSection from "@/components/home/VideoSection.vue";
import NavBar from "@/components/NavBar.vue";
import SocialMedia from "@/components/home/SocialMedia.vue";
import VideoCard from "@/components/search-video/VideoCard.vue";

export default {
  name: "SearchResultPage",
  components: {
    HomeHeader,
    VideoSection,
    NavBar,
    SocialMedia,
    VideoCard,
  },

  setup() {
    const videos = ref([]);
    const route = useRoute();
    const title = ref("");
    const isLoading = ref(true);

    onMounted(() => {
      const decodedTitle = decodeURIComponent(route.params.title);
      title.value = decodedTitle;
      getSearchedVideo();
    });

    const getSearchedVideo = async () => {
      try {
        const response = await fetch(
          `https://crac-server.onrender.com/api/videos/search/${title.value}`
        );
        const json = await response.json();
        videos.value = json.videos;
        isLoading.value = false;
      } catch (error) {
        console.error(error);
      }
    };

    return {
      videos,
      title,
      isLoading,
      getSearchedVideo,
    };
  },
};
</script>

<style scoped>
.video-wrapper {
  height: 86vh;
}
</style>
