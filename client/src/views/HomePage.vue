<template>
  <div class="w-full h-screen relative overflow-hidden">
    <HomeHeader @video-id="searchedVideoId = $event" />
    <div class="video-wrapper">
      <VideoSection
        @shareClicked="toggleSocialMedia"
        @video-id="handleVideoId"
        :searchedVideoId="searchedVideoId"
        @video-clicked="handleVideoClicked"
      />
    </div>
    <NavBar />
    <div v-if="showSocialMedia">
      <SocialMedia
        :show="showSocialMedia"
        :videoId="currentVideoId"
        @closeClicked="closeSocialMedia"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import HomeHeader from "@/components/home/HomeHeader.vue";
import VideoSection from "@/components/home/VideoSection.vue";
import NavBar from "@/components/NavBar.vue";
import SocialMedia from "@/components/home/SocialMedia.vue";
import { useRouter } from "vue-router";

export default {
  name: "HomePage",
  components: {
    HomeHeader,
    VideoSection,
    NavBar,
    SocialMedia,
  },

  setup(props) {
    const router = useRouter();
    const showSocialMedia = ref(false);
    const currentVideoId = ref("");
    const searchedVideoId = ref(null);

    const toggleSocialMedia = () => {
      showSocialMedia.value = !showSocialMedia.value;
    };

    const closeSocialMedia = () => {
      showSocialMedia.value = false;
    };

    const handleVideoId = (videoId) => {
      router.push({ name: "HomePage", params: { id: videoId } });
    };

    const handleVideoClicked = ({ index, id }) => {
      console.log("Clicked video index:", index);
      console.log("Clicked video ID:", id);
    };

    watch(searchedVideoId, (newVideoId) => {
      if (newVideoId !== null) {
        currentVideoId.value = newVideoId;
      }
      console.log("searchedVideoId:", newVideoId);
    });

    onMounted(() => {
      console.log("searchedVideoId:", props.searchedVideoId);
      const { params } = router.currentRoute.value;
      if (params.id) {
        currentVideoId.value = params.id;
      }
    });

    return {
      showSocialMedia,
      toggleSocialMedia,
      closeSocialMedia,
      currentVideoId,
      searchedVideoId,
      handleVideoId,
      handleVideoClicked,
    };
  },
};
</script>

<style scoped>
.video-wrapper {
  height: 86vh;
}
</style>
