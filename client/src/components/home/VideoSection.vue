<template>
  <div
    class="video-container"
    ref="videoContainer"
    @scroll="handleScroll"
    id="videoScroll"
  >
    <!-- <p class="text-xl text-red-500">searchedVideoId: {{ searchedVideoId }}</p> -->
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
</template>

<script>
import { onMounted, ref, watch } from "vue";
import SideNav from "@/components/home/SideNav.vue";
import SocialMedia from "./SocialMedia.vue";

export default {
  name: "VideoSection",
  components: {
    SideNav,
    SocialMedia,
  },
  props: {
    error: {
      type: String,
    },
    searchedVideoIdProp: {
      type: String,
      default: null,
    },
  },
  emits: ["video-id"],
  setup(props, { emit }) {
    const currentVideoId = ref(null);
    const currentVideoIndex = ref(0);
    const videos = ref([]);
    const videoRefs = ref([]);
    const videoContainer = ref(null);
    const showError = ref(false);
    const videosArrayLength = ref(0);
    const error = ref("");

    const searchedVideoId = ref(props.searchedVideoIdProp);

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
      console.log("currentVideoIndex.value", currentVideoIndex.value);
      emit("video-id", newVideoId);
    });

    watch(
      () => props.searchedVideoId,
      (newVideoId) => {
        searchedVideoId.value = newVideoId;
      }
    );

    onMounted(async () => {
      await getSearchedVideo();
      await getAllVideos();
    });

    const getSearchedVideo = async () => {
      const token = localStorage.getItem("accessToken");
      if (!searchedVideoId.value) {
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:6500/api/videos/${searchedVideoId.value}`,
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
        currentVideoId.value = video._id;
        videos.value = [video];
      } catch (error) {
        console.error(error);
      }
    };

    const getAllVideos = async () => {
      const token = localStorage.getItem("accessToken");
      if (searchedVideoId.value) {
        return;
      }
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
        videosArrayLength.value = videosArray.length;
        currentVideoId.value = videosArray[0]._id;
        videos.value = videosArray;
      } catch (error) {
        console.error(error);
      }
    };

    const toggleSocialMedia = () => {
      emit("shareClicked");
    };

    const handleScroll = (event) => {
      const container = videoContainer.value;
      const arrayHeight = container.scrollHeight;
      const elementHeight = arrayHeight / videosArrayLength.value;
      const elementIndex = Math.floor(container.scrollTop / elementHeight);
      const scrollTop = container.scrollTop;
      const currentLocation = elementHeight * elementIndex;
      console.log("currentLocation", currentLocation);

      // if (!checkScrollDirectionIsUp(event)) {
      if (scrollTop + elementHeight > currentLocation + elementHeight) {
        const newVideoIndex = elementIndex + 1;
        currentVideoIndex.value = newVideoIndex;
        currentVideoId.value = videos.value[newVideoIndex]._id;

        const nextVideoElement = videoRefs.value[newVideoIndex];
        const scrollToNextElement = () => {
          nextVideoElement.scrollIntoView(true);
        };
        setTimeout(() => {
          scrollToNextElement();
        }, 500);
        console.log("elementHeight", elementHeight);
      } else if (scrollTop < elementHeight) {
        const previousVideoIndex = elementIndex - 1;
        currentVideoIndex.value = previousVideoIndex;
        currentVideoId.value = videos.value[currentVideoIndex.value]._id;

        const previousVideoElement = videoRefs.value[previousVideoIndex];

        const scrollToPreviousElement = () => {
          previousVideoElement.scrollIntoView(true);
        };
        setTimeout(() => {
          scrollToPreviousElement();
        }, 500);
      }
    };

    // const checkScrollDirectionIsUp = (event) => {
    //   if (event.wheelDelta) {
    //     return event.wheelDelta > 0;
    //   }
    //   return event.deltaY < 0;
    // };
    // const scrollableElement = document.body;
    // scrollableElement.addEventListener("wheel", handleScroll);

    return {
      currentVideoId,
      currentVideoIndex,
      videos,
      videoRefs,
      showError,
      error,
      videoContainer,
      searchedVideoId,
      getVideoRef,
      handleErrorMessage,
      getAllVideos,
      getSearchedVideo,
      handleScroll,
      toggleSocialMedia,
    };
  },
};
</script>

<style scoped>
.video-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
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
  align-items: center;
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
