<template>
  <div class="w-full h-screen relative">
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
        <section
          class="absolute bottom-20 left-0 w-full items-center flex justify-between"
        >
          <aside class="ml-4">
            <p
              class="text-base text-primary-200"
              style="text-shadow: 0.5px 0.5px #262626"
            >
              #{{ video.username }}
            </p>
            <div v-if="video.title" class="w-8/12 relative">
              <div
                v-if="!showFullTitle"
                class="-mt-1 ml-2 relative w-full"
                style="text-shadow: 0.5px 0.5px #262626"
              >
                <p class="text-sm text-label">{{ shortTitle }}</p>
              </div>
              <div
                v-else
                class="-mt-1 ml-2 relative w-4/5 h-20 overflow-auto"
                id="long-title"
                style="text-shadow: 0.5px 0.5px #262626"
              >
                <p class="text-sm text-label w-full">{{ video.title }}</p>
              </div>
              <button
                v-if="videoTitle.length > 45"
                @click="toggleFullTitle"
                class="absolute -right-4 -bottom-2 text-xs ml-2 text-primary-200"
              >
                {{ showFullTitle ? "Hide" : "More..." }}
              </button>
            </div>
          </aside>
          <aside class="mr-4" v-if="currentUserId !== paramsId">
            <button class="relative" @click="handleProfile">
              <div
                class="flex items-center justify-center bg-gray-700 rounded-full w-10 h-10 justify-center border border-gray-200 overflow-hidden"
              >
                <img :src="video.userImage" class="h-10 object-cover spin" />
              </div>
            </button>
          </aside>
        </section>
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
import { ref, inject, reactive, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import NavBar from "@/components/NavBar.vue";
import MediaTitle from "@/components/MediaTitle.vue";

export default {
  name: "ViewVideo",
  components: {
    NavBar,
    MediaTitle,
  },
  props: {
    id: String,
  },

  setup(props) {
    const route = useRoute();
    const router = useRouter();
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
    const videoTitle = ref("");
    const showFullTitle = ref(false);

    const state = reactive({
      playing: false,
    });

    onMounted(async () => {
      await store.methods.load();
      videoId.value = route.params.video;
      paramsId.value = route.params.id;
      currentUserId.value = store.state.userData?._id;
      console.log("userId", paramsId.value);
      getVideo();
    });

    const toggleFullTitle = () => {
      showFullTitle.value = !showFullTitle.value;
    };

    const shortTitle = computed(() => {
      const maxCharacters = 45;
      if (videoTitle.value.length <= maxCharacters) {
        return videoTitle.value;
      } else {
        return videoTitle.value.slice(0, maxCharacters) + "...";
      }
    });

    const getVideo = async () => {
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
        videoTitle.value = video.title;
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
        getVideo();
      }
    );

    const handleProfile = () => {
      if (paramsId.value !== currentUserId.value) {
        router.push(`/friend/profile/${paramsId.value}`);
      } else {
        router.push(`/profile/${currentUserId.value}`);
      }
    };

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
      videoTitle,
      paramsId,
      currentUserId,
      showFullTitle,
      shortTitle,
      userImage,
      username,
      videoId,
      showModel,
      toggleFullTitle,
      toggleSocialMedia,
      closeSocialMedia,
      getVideo,
      handleProfile,
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
}

.spin {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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
#long-title::-webkit-scrollbar {
  width: 5px;
}
#long-title::-webkit-scrollbar-thumb {
  background: #ba2f74;
  border-radius: 2px;
}
#long-title::-webkit-scrollbar-track {
  background: rgba(187, 174, 174, 0.2);
}
</style>
