<template>
  <div class="relative w-full h-full">
    <div class="error-container">
      <p v-if="showError" class="text-sm text-gray-200">
        {{ error }}
      </p>
    </div>
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
        class="text-sm text-label -mt-1 ml-2 w-4/5 relative"
        style="text-shadow: 0.5px 0.5px #262626"
      >
        <span v-if="!showFullTitle">{{ shortTitle }}</span>
        <span v-else>{{ video.title }}</span>

        <button
          v-if="video.title.length > 45"
          @click="toggleFullTitle"
          class="absolute right-0 bottom-0 text-xs ml-2 text-primary-200"
        >
          {{ showFullTitle ? "Hide" : "More..." }}
        </button>
      </p>
    </div>
    <div class="absolute bottom-20 right-4 z-30">
      <SideNav
        @shareClicked="toggleSocialMedia"
        @commentClicked="toggleComment"
        @error-message="handleErrorMessage"
        :userId="video.userId"
        :userImage="video.userImage"
        :videoUrl="video.url"
        :videoId="video._id"
        :amountOfLike="video.amountOfLike"
      ></SideNav>
    </div>
  </div>
</template>
<script>
import { ref, reactive, onMounted, watch, computed } from "vue";
import SideNav from "@/components/home/SideNav.vue";
import { useRouter } from "vue-router";

export default {
  name: "Video",
  props: {
    video: Object,
    index: Number,
  },
  components: {
    SideNav,
  },
  setup(props, { emit }) {
    const error = ref("");
    const vidRef = ref(null);
    const showError = ref(false);
    const previousVisibality = ref(0);
    const currentVideoId = ref(props.video._id);
    const router = useRouter();

    const state = reactive({
      playing: false,
    });

    const showFullTitle = ref(false);

    const play = () => {
      vidRef.value.play();
      state.playing = true;
    };

    const pause = () => {
      vidRef.value.pause();
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

    const handleVideoId = () => {
      router.push({
        name: "HomePage",
        params: { id: currentVideoId.value },
      });
    };

    watch(
      () => props.video,
      (newVal) => {
        currentVideoId.value = newVal._id;
      },
      { immediate: true }
    );

    const handleShareClicked = (videoId) => {
      emit("shareClicked", videoId);
    };

    const toggleFullTitle = () => {
      showFullTitle.value = !showFullTitle.value;
    };

    const shortTitle = computed(() => {
      const maxCharacters = 45;
      if (props.video.title.length <= maxCharacters) {
        return props.video.title;
      } else {
        return props.video.title.slice(0, maxCharacters) + "...";
      }
    });

    const handleErrorMessage = (value) => {
      error.value = value;
      showError.value = true;
      setTimeout(() => {
        showError.value = false;
      }, 2000);
    };

    onMounted(() => {
      currentVideoId.value = props.video._id;
      const observer = new IntersectionObserver(
        (enteries) => {
          enteries.forEach((entry) => {
            if (entry.intersectionRatio > previousVisibality.value) {
              handleVideoId();
            }
            previousVisibality.value = entry.intersectionRatio;
          });
        },
        {
          threshold: 0.5,
        }
      );
      observer.observe(vidRef.value);
    });

    const toggleSocialMedia = (videoId) => {
      emit("shareClicked", videoId);
    };

    const toggleComment = (videoId) => {
      emit("commentClicked", videoId);
    };

    return {
      vidRef,
      error,
      state,
      showError,
      previousVisibality,
      play,
      pause,
      currentVideoId,
      handleVideoId,
      togglePlay,
      handleErrorMessage,
      toggleSocialMedia,
      toggleComment,
      handleShareClicked,
      showFullTitle,
      shortTitle,
      toggleFullTitle,
    };
  },
};
</script>

<style scoped>
.video {
  width: 100%;
  height: 100%;
}
.error-container {
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
</style>
