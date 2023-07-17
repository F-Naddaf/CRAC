<template>
  <div class="w-full h-screen relative">
    <div class="message-container">
      <p v-if="showMessage" class="text-sm text-gray-200">
        {{ message }}
      </p>
    </div>
    <div v-if="currentUserId === paramsId" class="absolute right-2 top-4 z-10">
      <EditDeleteVideo
        :posted="posted"
        @showModel="handleShowModel"
        @toggleShowMessage="handleShowMesssage"
        @toggleMessage="handleMessage"
        :videoId="videoId"
        :paramsId="paramsId"
      />
    </div>
    <Video
      v-for="(video, index) in videos"
      :key="video._id"
      :id="video._id"
      :video="video"
      :index="index"
      @shareClicked="toggleSocialMedia"
      @commentClicked="toggleComment"
      :commentsAmount="commentsAmount"
    >
    </Video>
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
    <div
      class="absolute w-full h-full top-0 left-0 bg-black bg-opacity-70"
      v-if="showModel"
    >
      <MediaTitle
        @close="close"
        :close="close"
        :url="url"
        :userId="userId"
        :userImage="userImage"
        :username="username"
      />
    </div>
  </div>
</template>

<script>
import { ref, inject, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import NavBar from "@/components/NavBar.vue";
import MediaTitle from "@/components/MediaTitle.vue";
import SocialMedia from "@/components/home/SocialMedia.vue";
import Comment from "@/components/home/Comment.vue";
import Video from "@/components/home/Video.vue";
import EditDeleteVideo from "@/components/view-video/EditDeleteVideo.vue";

export default {
  name: "ViewVideo",
  components: {
    Video,
    NavBar,
    MediaTitle,
    SocialMedia,
    Comment,
    EditDeleteVideo,
  },
  props: {
    id: String,
    commentsAmount: Number,
  },

  setup(props) {
    const route = useRoute();
    const store = inject("store");
    const showSocialMedia = ref(false);
    const videos = ref([]);
    const showModel = ref(false);
    const videoId = ref(null);
    const showMessage = ref(false);
    const error = ref("");
    const showError = ref(false);
    const message = ref("");
    const url = ref(null);
    const userId = ref(null);
    const paramsId = ref("");
    const currentUserId = ref("");
    const userImage = ref(null);
    const username = ref(null);
    const posted = ref(null);
    const showComment = ref(false);
    const videoFavorite = ref(0);
    const commentAmount = ref(0);

    onMounted(async () => {
      await store.methods.load();
      videoId.value = route.params.id;
      paramsId.value = route.params.userId;
      currentUserId.value = store.state.userData?._id;
      await getVideo();
    });

    const toggleComment = () => {
      showComment.value = !showComment.value;
    };

    const handleErrorMessage = (value) => {
      error.value = value;
      showError.value = true;
      setTimeout(() => {
        showError.value = false;
      }, 2000);
    };

    const closeComment = () => {
      showComment.value = false;
    };

    const handleShowMesssage = (value) => {
      showMessage.value = value;
    };

    const handleMessage = (value) => {
      message.value = value;
    };

    const commentsLength = (amount) => {
      commentAmount.value = amount;
    };

    const getVideo = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch(
          `https://crac-server.onrender.com/api/videos/result/${videoId.value}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await response.json();
        const video = json.video;
        url.value = video.url;
        userId.value = video.userId;
        userImage.value = video.userImage;
        username.value = video.username;
        posted.value = video.posted;
        videos.value.push(video);
      } catch (error) {
        console.error(error);
      }
    };

    watch(
      () => route.params.userId,
      (newVideoId) => {
        videoId.value = newVideoId;
        getVideo();
      }
    );

    const toggleSocialMedia = () => {
      showSocialMedia.value = !showSocialMedia.value;
    };

    const closeSocialMedia = () => {
      showSocialMedia.value = false;
    };

    const close = () => {
      showModel.value = false;
    };

    const handleShowModel = (val) => {
      showModel.value = val;
    };

    return {
      store,
      showSocialMedia,
      videos,
      message,
      showMessage,
      url,
      posted,
      userId,
      paramsId,
      currentUserId,
      userImage,
      username,
      videoId,
      showModel,
      videoFavorite,
      toggleSocialMedia,
      closeSocialMedia,
      getVideo,
      close,
      toggleComment,
      closeComment,
      commentAmount,
      commentsLength,
      showComment,
      error,
      showError,
      handleErrorMessage,
      handleShowModel,
      handleShowMesssage,
      handleMessage,
    };
  },
};
</script>

<style scoped>
.video-wrapper {
  height: 94vh;
}
.message-container {
  display: grid;
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  justify-content: center;
  width: fit-content;
  max-width: 95%;
  background-color: #ba2f74;
  border-radius: 5px;
  padding: 0 15px;
  z-index: 20;
  white-space: nowrap;
  overflow: hidden;
}
</style>
