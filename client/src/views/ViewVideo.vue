<template>
  <div class="w-full h-screen relative">
    <HomeHeader />
    <div class="video-wrapper">
      <div class="message-container">
        <p v-if="showMessage" class="text-sm text-gray-200">
          {{ message }}
        </p>
      </div>
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
            class="text-sm text-label -mt-1 ml-2 w-4/5"
            style="text-shadow: 0.5px 0.5px #262626"
          >
            {{ video.title }}
          </p>
        </div>
        <div
          v-if="currentUserId === paramsId"
          class="absolute right-2 bottom-20 flex w-28 items-center justify-between"
        >
          <button
            v-if="!video.posted"
            class="text-sm text-gray-100 -mb-1 w-12 h-6 bg-secondary-100 rounded"
            id="post-btn"
            style="text-shadow: 0.5px 0.5px #262626"
            @click="postNow"
          >
            Post
          </button>
          <button
            v-else
            class="text-sm text-gray-100 -mb-1 w-12 h-6 bg-secondary-100 rounded"
            id="edit-btn"
            style="text-shadow: 0.5px 0.5px #262626"
            @click="postNow"
          >
            Edit
          </button>
          <button
            class="text-sm text-gray-100 -mb-1 w-12 h-6 bg-primary-100 rounded"
            id="delete-btn"
            style="text-shadow: 0.5px 0.5px #262626"
            @click="deleteVideo"
          >
            Delete
          </button>
        </div>
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
import { ref, inject, reactive, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
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
  props: {
    id: String,
  },

  setup(props) {
    const store = inject("store");
    const showSocialMedia = ref(false);
    const videos = ref([]);
    const showModel = ref(false);
    const videoId = ref(null);
    const showMessage = ref(false);
    const message = ref("");
    const url = ref(null);
    const userId = ref(null);
    const paramsId = ref("");
    const currentUserId = ref("");
    const userImage = ref(null);
    const username = ref(null);
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      playing: false,
    });

    onMounted(async () => {
      await store.methods.load();
      videoId.value = route.params.video;
      paramsId.value = route.params.id;
      currentUserId.value = store.state.userData?._id;
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

    const deleteVideo = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch(
          `http://localhost:6500/api/videos/deleteVideo/${videoId.value}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await response.json();
        if (json.success) {
          showMessage.value = true;
          message.value = json.message;
          setTimeout(() => {
            router.push({
              name: "Profile",
              params: { id: paramsId.value },
            });
          }, 2000);
        }
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
      store,
      showSocialMedia,
      state,
      videos,
      message,
      showMessage,
      url,
      userId,
      paramsId,
      currentUserId,
      userImage,
      username,
      videoId,
      showModel,
      toggleSocialMedia,
      closeSocialMedia,
      getSearchedVideo,
      deleteVideo,
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
  /* text-overflow: ellipsis; */
}
#post-btn:hover {
  background-color: #034663;
  color: rgb(206, 206, 206);
}
#edit-btn:hover {
  background-color: #034663;
  color: rgb(206, 206, 206);
}
#delete-btn:hover {
  background-color: #820342;
  color: rgb(206, 206, 206);
}
</style>
