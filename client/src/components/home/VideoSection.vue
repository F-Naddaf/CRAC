<template>
  <div
    class="video-section"
    ref="VideoSection"
    v-if="enableSwipe"
    v-swipe="onSwipe"
    :style="state.style"
  >
    <Video
      v-for="(video, index) in videos"
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
      @shareClicked="toggleSocialMedia"
      @commentClicked="toggleComment"
      @vidRef="videoRef"
      :commentsAmount="commentsAmount"
    >
    </Video>
  </div>
</template>

<script>
import { ref, reactive, watch, computed, onBeforeUpdate } from "vue";
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
  props: {
    videos: Array,
    commentsAmount: Number,
  },
  setup(props, { emit }) {
    const videos = ref(props.videos);
    const videoRefs = ref([]);
    const currentVideoRef = ref(null);
    const currentVideoIndex = ref(0);
    const videoRefrance = ref(null);

    const state = reactive({
      currentSlide: 1,
      amoundOfSlides: 0,
      style: {
        transform: computed(
          () => `translate3d(0, ${-(state.currentSlide - 1) * 100}%, 0)`
        ),
      },
    });

    const videoRef = (value) => {
      videoRefrance.value = value;
    };

    const enableSwipe = computed(() => videos.value.length > 0);

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
      (newSlide, oldSlide) => {
        currentVideoIndex.value = newSlide - 1;
        if (videoRefs.value[newSlide - 1]) {
          if (videoRefs.value[oldSlide - 1]) {
            const previousVideo = videoRefs.value[oldSlide - 1].$refs.video;
            if (previousVideo) {
              previousVideo.pause();
            }
          }
          videoRefs.value[newSlide - 1].play();
        }
      },
      {
        lazy: false,
      }
    );

    const toggleSocialMedia = (videoId) => {
      emit("shareClicked", videoId);
    };

    const toggleComment = (videoId) => {
      emit("commentClicked", videoId);
    };

    return {
      videos,
      videoRefs,
      currentVideoRef,
      currentVideoIndex,
      state,
      onSwipe,
      enableSwipe,
      toggleSocialMedia,
      toggleComment,
      videoRefrance,
      videoRef,
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
