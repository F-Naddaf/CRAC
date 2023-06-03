<template>
  <div class="video-container" ref="videoContainer" @scroll="handleScroll">
    <div class="video-section">
      <div
        class="relative"
        v-for="(video, index) in videos"
        :key="video._id"
        :ref="getVideoRef(index)"
      >
        <video loop autoplay class="video" :data-index="index">
          <source class="source" :src="video.url" type="video/mp4" />
        </video>
        <div
          class="absolute bottom-10 right-4 z-30"
          v-if="index === currentVideoIndex"
        >
          <SideNav
            @shareClicked="toggleSocialMedia"
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

  setup(props, { emit }) {
    const currentVideoId = ref(null);
    const currentVideoIndex = ref(0);
    const videos = ref([]);
    const videoRefs = ref([]);
    const videoContainer = ref(null);
    const showSocialMedia = ref(false);

    onMounted(async () => {
      await getAllVideos();
      console.log("showSocialMedia ", showSocialMedia);
    });

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
      videoContainer,
      showSocialMedia,
      getVideoRef,
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
