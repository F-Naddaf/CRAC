<template>
  <div
    class="video-section"
    ref="VideoSection"
    v-swipe="onSwipe"
    :style="state.style"
  >
    <Video
      v-for="(video, i) in videos"
      :key="video.id"
      :id="video._id"
      :video="video"
      :index="i"
      :ref="
        (el) => {
          videoRefs[i] = el;
          if (currentVideoIndex.value === i) {
            currentVideoRef.value = el;
            if (state.currentSlide === i + 1) {
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
  setup(props, { emit }) {
    const videos = ref([]);
    const videoRefs = ref([]);
    // const i = ref(null);
    const currentVideoRef = ref(null);
    const currentVideoIndex = ref(0);
    // const nextVideo = ref(null);

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

    watch(
      () => state.currentSlide,
      (items, oldItems) => {
        if (videoRefs.value[items - 1]) {
          videoRefs.value[items - 1].play();
        }
        if (videoRefs.value[oldItems - 1]) {
          videoRefs.value[oldItems - 1].pause();
        }
      },
      {
        lazy: false,
      }
    );

    onMounted(async () => {
      await getAllVideos();
    });

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
      // nextVideo,
      state,
      onSwipe,
      getAllVideos,
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
