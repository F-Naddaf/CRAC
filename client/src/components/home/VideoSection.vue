<template>
  <div
    class="video-section"
    ref="VideoSection"
    v-swipe="onSwipe"
    :style="state.style"
  >
    <Video
      v-for="(video, index) in videos"
      @video-clicked="handleVideoClicked(video._id, index)"
      :key="video._id"
      :id="video._id"
      :video="video"
      :index="index"
      :ref="
        (el) => {
          videoRefs[index] = el;
          if (currentVideoIndex.value === index) {
            currentVideoRef.value = el;
            if (state.currentSlide === index + 1) {
              el.play();
            } else {
              el.pause();
            }
          }
        }
      "
    >
    </Video>
  </div>
</template>

<script>
import { onMounted, ref, reactive, watch, computed, onBeforeUpdate } from "vue";
import SocialMedia from "./SocialMedia.vue";
import swipe from "../directives/swipe.js";
import Video from "./Video.vue";

export default {
  name: "VideoSection",
  directives: {
    swipe,
  },
  components: {
    SocialMedia,
    Video,
  },
  emits: ["video-id"],
  props: ["router"],
  setup(props, { emit }) {
    const videos = ref([]);
    const videoRefs = ref([]);
    const currentVideoRef = ref(null);
    const currentVideoIndex = ref(0);
    const currentVideoId = ref("");
    const firstVideo = ref("");

    const state = reactive({
      currentSlide: 1,
      amoundOfSlides: 0,
      style: {
        transform: computed(
          () => `translate3d(0, ${-(state.currentSlide - 1) * 100}%, 0)`
        ),
      },
    });

    const onSwipe = (direction) => {
      if (
        (direction === 1 && state.currentSlide === state.amoundOfSlides) ||
        (direction === -1 && state.currentSlide === 1)
      ) {
        return;
      }

      const nextSlide = state.currentSlide + direction;

      if (direction === 1 && !videos.value[nextSlide - 1]) {
        return;
      }

      state.currentSlide = nextSlide;
    };

    onBeforeUpdate(() => {
      videoRefs.value = [];
    });

    // watch(
    //   () => state.currentSlide,
    //   (items, oldItems) => {
    //     if (videoRefs.value[items - 1]) {
    //       videoRefs.value[items - 1].play();
    //     }
    //     if (videoRefs.value[oldItems - 1]) {
    //       videoRefs.value[oldItems - 1].pause();
    //     }
    //   },
    //   {
    //     lazy: false,
    //   }
    // );

    const handleVideoClicked = (videoId, index) => {
      console.log("Clicked video index:", index);
      console.log("Clicked video ID:", videoId);
      currentVideoId.value = videoId;
      props.router.push({ name: "HomePage", params: { id: videoId } });
    };

    // onMounted(async () => {
    //   await getAllVideos();
    //   const { params } = props.router.currentRoute.value;
    //   if (!params.id && videos.value.length > 0) {
    //     currentVideoId.value = videos.value[0].id;
    //   }
    // });

    onMounted(async () => {
      await getAllVideos();
    });

    // watch(
    //   () => videos.value,
    //   (newVideos) => {
    //     if (
    //       newVideos.length > 0 &&
    //       !props.router.currentRoute.value.params.id
    //     ) {
    //       currentVideoId.value = newVideos[0].id;
    //     }
    //   }
    // );

    watch(
      () => state.currentSlide,
      (newSlide, oldSlide) => {
        if (videoRefs.value[newSlide - 1]) {
          videoRefs.value[newSlide - 1].play();
        }
        if (videoRefs.value[oldSlide - 1]) {
          videoRefs.value[oldSlide - 1].pause();
        }
      },
      {
        lazy: false,
      }
    );

    // const getSearchedVideo = async () => {
    //   const token = localStorage.getItem("accessToken");
    //   if (!searchedVideoId.value) {
    //     return;
    //   }
    //   try {
    //     const response = await fetch(
    //       `http://localhost:6500/api/videos/${searchedVideoId.value}`,
    //       {
    //         method: "GET",
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: `Bearer ${token}`,
    //         },
    //       }
    //     );
    //     const json = await response.json();
    //     const video = json.video;
    //     // currentVideoId.value = video._id;
    //     videos.value = [video];
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

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
        console.log("videosArray", videosArray);
        firstVideo.value = videosArray[0]._id;
        // console.log("firstVideo.value", firstVideo.value);
        videos.value = videosArray;
      } catch (error) {
        console.error(error);
      }
    };

    return {
      videos,
      videoRefs,
      currentVideoRef,
      currentVideoIndex,
      currentVideoId,
      firstVideo,
      state,
      onSwipe,
      getAllVideos,
      handleVideoClicked,
    };
  },
};
</script>

<style scoped>
.video-section {
  position: relative;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  transform: translate3d(0, 0, 0);
  transition: transform 200ms ease;
}
</style>
