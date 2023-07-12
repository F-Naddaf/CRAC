<template>
  <div class="w-full h-screen relative overflow-hidden">
    <HomeHeader @active-users-clicked="handleShowActiveUsers" />
    <div class="video-wrapper">
      <template v-if="videos.length > 0">
        <VideoSection
          @shareClicked="toggleSocialMedia"
          @commentClicked="toggleComment"
          :videos="videos"
          :commentsAmount="commentsAmount"
        />
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
    <Comment
      v-if="showComment"
      :show="showComment"
      :videoId="videoId"
      @closeClicked="closeComment"
      @commentsAmount="commentsLength"
    />
    <div class="card-container" v-if="showActiveUsersCard">
      <ActiveUsersCard
        :showCard="showActiveUsersCard"
        @close-clicked="handleCloseActiveUsers"
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
import Comment from "@/components/home/Comment.vue";
import ActiveUsersCard from "@/components/home/ActiveUsersCard.vue";

export default {
  name: "HomePage",
  components: {
    HomeHeader,
    VideoSection,
    NavBar,
    SocialMedia,
    Comment,
    ActiveUsersCard,
  },

  setup(props) {
    const route = useRoute();
    const showSocialMedia = ref(false);
    const showComment = ref(false);
    const videos = ref([]);
    const commentsAmount = ref(0);
    const videoId = route.params.id;
    const showActiveUsersCard = ref(false);

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

    const handleShowActiveUsers = () => {
      showActiveUsersCard.value = true;
    };

    const toggleSocialMedia = () => {
      showSocialMedia.value = !showSocialMedia.value;
    };

    const toggleComment = () => {
      showComment.value = !showComment.value;
    };

    const closeSocialMedia = () => {
      showSocialMedia.value = false;
    };

    const closeComment = () => {
      showComment.value = false;
    };

    const commentsLength = (amount) => {
      commentsAmount.value = amount;
    };

    const handleCloseActiveUsers = () => {
      showActiveUsersCard.value = false;
    };

    onMounted(async () => {
      await getAllVideos();
    });

    return {
      showSocialMedia,
      showComment,
      videos,
      videoId,
      showActiveUsersCard,
      toggleSocialMedia,
      toggleComment,
      closeSocialMedia,
      closeComment,
      getAllVideos,
      commentsAmount,
      commentsLength,
      handleShowActiveUsers,
      handleCloseActiveUsers,
    };
  },
};
</script>

<style scoped>
.video-wrapper {
  height: 94vh;
}
.card-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 150;
}
</style>
