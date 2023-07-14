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
        <audio v-if="video.audio !== ''" ref="audioRef">
          <source :src="video.audio" type="audio/mpeg" />
        </audio>
        <section
          class="absolute bottom-20 left-0 w-full items-center flex justify-between"
        >
          <div class="relative w-full">
            <aside class="ml-4 w-full">
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
                  v-if="videoTitle.length > 35"
                  @click="toggleFullTitle"
                  class="absolute right-0 -bottom-2 text-xs ml-2 text-primary-200"
                >
                  {{ showFullTitle ? "Hide" : "More..." }}
                </button>
              </div>
            </aside>
            <aside class="absolute -bottom-1 right-20" v-if="video.songImage">
              <div
                class="w-10 h-10 rounded-full overflow-hidden border border-gray-200"
              >
                <img :src="video.songImage" class="h-10 object-cover spin" />
              </div>
            </aside>
          </div>
        </section>
        <div class="absolute right-4 z-30" style="bottom: 86px">
          <SideNav
            @shareClicked="toggleSocialMedia"
            @commentClicked="toggleComment"
            @error-message="handleErrorMessage"
            :userId="video.userId"
            :userImage="video.userImage"
            :videoUrl="video.url"
            :videoId="video._id"
            :videoFavorite="videoFavorite"
            :amountOfComments="video.amountOfComments"
            :commentAmount="commentAmount"
            :saved="video.saved"
          ></SideNav>
        </div>
        <div
          v-if="currentUserId === paramsId"
          class="absolute right-2 top-4 flex w-28 items-center justify-between"
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
      <div v-if="showSocialMedia">
        <SocialMedia
          :show="showSocialMedia"
          :videoId="videoId"
          @closeClicked="closeSocialMedia"
        />
      </div>
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
      <Comment
        v-if="showComment"
        :show="showComment"
        @closeClicked="closeComment"
        @commentsAmount="commentsLength"
      />
    </div>
  </div>
</template>

<script>
import {
  ref as toRef,
  inject,
  reactive,
  onMounted,
  watch,
  computed,
} from "vue";
import { ref, listAll, deleteObject } from "firebase/storage";
import { storage } from "../firebase.js";
import { useRoute, useRouter } from "vue-router";
import NavBar from "@/components/NavBar.vue";
import MediaTitle from "@/components/MediaTitle.vue";
import SideNav from "@/components/home/SideNav.vue";
import SocialMedia from "@/components/home/SocialMedia.vue";
import Comment from "@/components/home/Comment.vue";

export default {
  name: "ViewVideo",
  components: {
    NavBar,
    SideNav,
    MediaTitle,
    SocialMedia,
    Comment,
  },
  props: {
    id: String,
  },

  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const store = inject("store");
    const showSocialMedia = toRef(false);
    const videos = toRef([]);
    const showModel = toRef(false);
    const videoId = toRef(null);
    const showMessage = toRef(false);
    const error = toRef("");
    const showError = toRef(false);
    const message = toRef("");
    const url = toRef(null);
    const userId = toRef(null);
    const paramsId = toRef("");
    const currentUserId = toRef("");
    const userImage = toRef(null);
    const username = toRef(null);
    const videoTitle = toRef("");
    const showFullTitle = toRef(false);
    const showComment = toRef(false);
    const videoFavorite = toRef(0);
    const commentAmount = toRef(0);
    const vidRef = ref(null);

    const state = reactive({
      playing: false,
    });

    onMounted(async () => {
      await store.methods.load();
      videoId.value = route.params.id;
      paramsId.value = route.params.userId;
      currentUserId.value = store.state.userData?._id;
      getVideo();
    });

    const toggleFullTitle = () => {
      showFullTitle.value = !showFullTitle.value;
    };

    const shortTitle = computed(() => {
      const maxCharacters = 35;
      if (videoTitle.value.length <= maxCharacters) {
        return videoTitle.value;
      } else {
        return videoTitle.value.slice(0, maxCharacters) + "...";
      }
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

    const commentsLength = (amount) => {
      commentAmount.value = amount;
    };

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
        videoFavorite.value = video.favorite;
        username.value = video.username;
        videoTitle.value = video.title;
        videos.value.push(video);
      } catch (error) {
        console.error(error);
      }
    };

    const findVideoWithHighestNumber = (items) => {
      const numbers = items.map((item) => {
        const match = item.name.match(/video-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });
      const highestNumber = Math.max(...numbers);
      const fileToDelete = items.find((item) => {
        const match = item.name.match(/video-(\d+)/);
        const number = match ? parseInt(match[1]) : 0;
        return number === highestNumber;
      });
      return { highestNumber, fileToDelete };
    };

    const deleteVideo = async () => {
      const storageRef = ref(storage);
      const videosRef = ref(storageRef, "videos/");

      const { items } = await listAll(videosRef);

      if (items.length > 0) {
        const { highestNumber, fileToDelete } =
          findVideoWithHighestNumber(items);

        if (fileToDelete) {
          const fileRef = ref(storageRef, fileToDelete.fullPath);
          await deleteObject(fileRef);
        }
      }
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
              params: { userId: paramsId.value },
            });
          }, 2000);
        }
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

    const postNow = () => {
      showModel.value = true;
    };

    const play = () => {
      if (vidRef.value !== null) {
        vidRef.value.play();
      }
      if (audioRef.value !== null) {
        audioRef.value.play();
      }
      state.playing = true;
    };

    const pause = () => {
      if (vidRef.value !== null) {
        vidRef.value.pause();
      }
      if (audioRef.value !== null) {
        audioRef.value.pause();
      }
      state.playing = false;
    };

    const togglePlay = () => {
      if (state.playing) {
        pause();
      } else {
        play();
      }
      props.video.playing = !props.video.playing;
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
      videoFavorite,
      vidRef,
      toggleFullTitle,
      toggleSocialMedia,
      closeSocialMedia,
      getVideo,
      play,
      pause,
      togglePlay,
      deleteVideo,
      postNow,
      close,
      toggleComment,
      closeComment,
      commentAmount,
      commentsLength,
      showComment,
      error,
      showError,
      handleErrorMessage,
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
