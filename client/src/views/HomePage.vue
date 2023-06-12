<template>
  <div class="w-full h-screen relative overflow-hidden">
    <HomeHeader />
    <div class="video-wrapper">
      <template v-if="videos.length > 0">
        <VideoSection @shareClicked="toggleSocialMedia" :videos="videos" />
      </template>
      <template v-else>
        <div>Loading...</div>
      </template>
    </div>
    <NavBar />
    <div v-if="showSocialMedia">
      <SocialMedia
        :show="showSocialMedia"
        :videoId="videoId"
        @closeClicked="closeSocialMedia"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import HomeHeader from "@/components/home/HomeHeader.vue";
import VideoSection from "@/components/home/VideoSection.vue";
import NavBar from "@/components/NavBar.vue";
import SocialMedia from "@/components/home/SocialMedia.vue";

export default {
  name: "HomePage",
  components: {
    HomeHeader,
    VideoSection,
    NavBar,
    SocialMedia,
  },

  setup(props) {
    const showSocialMedia = ref(false);
    const videos = ref([]);
    const route = useRoute();
    const videoId = route.params.id;

    const getAllVideos = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch("http://localhost:6500/api/videos", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await response.json();
        const videosArray = json.videos;
        videos.value = videosArray;
      } catch (error) {
        console.error(error);
      }
    };

    const toggleSocialMedia = () => {
      showSocialMedia.value = !showSocialMedia.value;
    };

    const closeSocialMedia = () => {
      showSocialMedia.value = false;
    };

    onMounted(async () => {
      await getAllVideos();
    });

    return {
      showSocialMedia,
      videos,
      videoId,
      toggleSocialMedia,
      closeSocialMedia,
      getAllVideos,
    };
  },
};
</script>

<style scoped>
.video-wrapper {
  height: 86vh;
}
</style>
