<template>
  <div class="w-full h-screen relative">
    <HomeHeader />
    <div class="video-wrapper">
      <div
        class="relative w-full h-full flex justify-center"
        v-for="video in videos"
        :key="video._id"
      >
        <video loop autoplay class="video" ref="vidRef" @click="togglePlay">
          <source
            class="source"
            :src="video.url"
            type="video/mp4"
            @click="togglePlay"
            v-show="!state.playing"
          />
        </video>
        <div class="absolute bottom-20 left-4">
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
        <button
          v-if="!video.posted"
          class="absolute right-6 bottom-20 text-sm text-label -mb-1 w-10 h-6 bg-primary-100 rounded"
          style="text-shadow: 0.5px 0.5px #262626"
          @click="postNow"
        >
          Post
        </button>
        <button
          v-else
          class="absolute right-6 bottom-20 text-sm text-label -mb-1 w-10 h-6 bg-primary-100 rounded"
          style="text-shadow: 0.5px 0.5px #262626"
          @click="postNow"
        >
          Edit
        </button>
      </div>
      <NavBar />
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
  </div>
</template>

<script>
import { ref, reactive, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import HomeHeader from "@/components/home/HomeHeader.vue";
import NavBar from "@/components/NavBar.vue";
import MediaTitle from "@/components/MediaTitle.vue";

export default {
  name: "ViewVideo",
  components: {
    HomeHeader,
    NavBar,
    MediaTitle,
  },

  setup(props) {
    const showSocialMedia = ref(false);
    const videos = ref([]);
    const showModel = ref(false);
    const videoId = ref(null);
    const url = ref(null);
    const userId = ref(null);
    const userImage = ref(null);
    const username = ref(null);
    const route = useRoute();

    const state = reactive({
      playing: false,
    });

    onMounted(() => {
      videoId.value = route.params.id;
      getSearchedVideo();
    });

    const getSearchedVideo = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch(
          `http://localhost:6500/api/videos/result/${videoId.value}`,
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
        videos.value.push(video);
      } catch (error) {
        console.error(error);
      }
    };

    watch(
      () => route.params.id,
      (newVideoId) => {
        videoId.value = newVideoId;
        getSearchedVideo();
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

    const postNow = () => {
      showModel.value = true;
    };

    return {
      showSocialMedia,
      state,
      videos,
      url,
      userId,
      userImage,
      username,
      videoId,
      showModel,
      toggleSocialMedia,
      closeSocialMedia,
      getSearchedVideo,
      postNow,
      close,
    };
  },
};
</script>

<style scoped>
.video-wrapper {
  height: 100vh;
}
</style>
