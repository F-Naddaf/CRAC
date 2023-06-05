<template>
  <div class="video-container" ref="videoContainer" @scroll="handleScroll">
    <div class="video-section">
      <div
        class="relative"
        v-for="(video, index) in videos"
        :key="video._id"
        :ref="getVideoRef(index)"
      >
        <div class="error-container">
          <p v-if="showError" class="text-sm text-gray-200">
            {{ error }}
          </p>
        </div>
        <video loop autoplay class="video" :data-index="index">
          <source class="source" :src="video.url" type="video/mp4" />
        </video>
        <div class="absolute bottom-4 left-4">
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
        <div
          class="absolute bottom-10 right-4 z-30"
          v-if="index === currentVideoIndex"
        >
          <SideNav
            @shareClicked="toggleSocialMedia"
            @error-message="handleErrorMessage"
            :userId="videos[currentVideoIndex].userId"
            :userImage="videos[currentVideoIndex].userImage"
            :videoUrl="videos[currentVideoIndex].url"
            :videoId="currentVideoId"
            :amountOfLike="videos[currentVideoIndex].amountOfLike"
          ></SideNav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import SideNav from "@/components/home/SideNav.vue";

export default {
  name: "VideoSection",
  components: {
    SideNav,
  },
  props: {
    error: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const currentVideoId = ref(null);
    const currentVideoIndex = ref(0);
    const videos = ref([]);
    const videoRefs = ref([]);
    const videoContainer = ref(null);
    const showSocialMedia = ref(false);
    const showError = ref(false);
    const error = ref("");

    onMounted(async () => {
      await getAllVideos();
    });

    const handleErrorMessage = (value) => {
      error.value = value;
      showError.value = true;
      setTimeout(() => {
        showError.value = false;
      }, 2000);
    };

    const getVideoRef = (index) => (el) => {
      videoRefs.value[index] = el;
    };

    watch(currentVideoId, (newVideoId) => {
      const videoIndex = videos.value.findIndex(
        (video) => video._id === newVideoId
      );
      currentVideoIndex.value = videoIndex;
    });

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
        currentVideoId.value = videosArray[0]._id;
        console.log("videosArray", videosArray);
        videos.value = videosArray;
      } catch (error) {
        console.error(error);
      }
    };

    const handleScroll = () => {
      //   const container = videoContainer.value;
      //   let video = videoRefs.value[currentVideoIndex.value];
      //   console.log("video", video);
      //   const scrollDown = 35;
      //   const viewportHeight = window.innerHeight;
      //   const videoViewPoint = (86 / 100) * viewportHeight;
      //   console.log("videoViewPoint", videoViewPoint);
      //   const placeVideo = videoViewPoint - scrollDown;
      //   const videoRect = video.getBoundingClientRect();
      //   const videoPosition = videoRect.top;
      //   console.log("videoPosition", videoPosition);
      //   if (videoPosition <= scrollDown) {
      //     currentVideoIndex.value++;
      //     console.log("newVideoIndex", currentVideoIndex.value);
      //     // if (currentVideoIndex.value >= videos.value.length) {
      //     //   currentVideoIndex.value = 0;
      //     // }
      //     currentVideoId.value = videos.value[currentVideoIndex.value]._id;
      //     console.log("currentVideoId.value", currentVideoId.value);
      //     console.log("currentVideoIndex.value", currentVideoIndex.value);
      //     container.scrollTop = (placeVideo + scrollDown) * currentVideoIndex;
      //     console.log("con", container.scrollTop);
      //   }
      //   //   else {
      //   //     currentVideoId.value = videos.value[currentVideoIndex.value]._id;
      //   //     container.scrollTop = videoViewPoint;
      //   }
    };

    const toggleSocialMedia = () => {
      emit("shareClicked");
    };

    return {
      currentVideoId,
      currentVideoIndex,
      videos,
      videoRefs,
      showError,
      error,
      videoContainer,
      showSocialMedia,
      getVideoRef,
      handleErrorMessage,
      getAllVideos,
      handleScroll,
      toggleSocialMedia,
    };
  },
};
</script>

<style scoped>
.video-container {
  display: flex;
  position: relative;
  overflow: scroll;
  width: 100%;
  height: 86vh;
}
.error-container {
  display: grid;
  position: absolute;
  top: 10px;
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

.video-section {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
video {
  width: 100%;
  height: 86vh;
}
.video-section video {
  object-fit: cover;
}
</style>
