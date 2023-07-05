<template>
  <div class="relative w-full h-full">
    <div class="error-container">
      <p v-if="showError" class="text-sm text-gray-200">
        {{ error }}
      </p>
    </div>
    <video class="video" ref="vidRef" @click="togglePlay" @ended="stopAudio">
      <source
        class="source"
        :src="video.url"
        type="video/mp4"
        v-show="!state.playing"
      />
    </video>
    <input
      class="seek"
      id="seekSlid"
      type="range"
      min="0"
      max="100"
      value="0"
      step="1"
      ref="seekSliderRef"
      @change="vidSeek"
    />
    <audio v-if="video.audio !== ''" ref="audioRef">
      <source :src="video.audio" type="audio/mpeg" />
    </audio>
    <div class="absolute bottom-20 left-4 w-full">
      <p
        class="text-base text-primary-200"
        style="text-shadow: 0.5px 0.5px #262626"
      >
        #{{ video.username }}
      </p>
      <div class="w-8/12 relative">
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
          v-if="video.title.length > 35"
          @click="toggleFullTitle"
          class="absolute -right-4 -bottom-2 text-xs ml-2 text-primary-200"
        >
          {{ showFullTitle ? "Hide" : "More..." }}
        </button>
      </div>
    </div>
    <div class="absolute bottom-24 right-4 z-30">
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
  </div>
</template>
<script>
import {
  ref,
  reactive,
  onMounted,
  watch,
  computed,
  watchEffect,
  nextTick,
} from "vue";
import SideNav from "@/components/home/SideNav.vue";
import { useRouter } from "vue-router";

export default {
  name: "Video",
  props: {
    video: Object,
    index: Number,
    commentAmount: Number,
  },
  components: {
    SideNav,
  },
  setup(props, { emit }) {
    const router = useRouter();
    const error = ref("");
    const vidRef = ref(null);
    const showError = ref(false);
    const previousVisibality = ref(0);
    const currentVideoId = ref(props.video._id);
    const videoFavorite = ref(props.video.favorite);
    const showFullTitle = ref(false);
    const seekSliderRef = ref(null);
    const audioRef = ref(null);

    watchEffect(() => {
      videoFavorite.value = props.video.favorite;
    });

    const state = reactive({
      playing: false,
    });

    const vidSeek = () => {
      const seekSlider = seekSliderRef.value;
      if (vidRef.value && audioRef.value) {
        const seekTo = vidRef.value.duration * (seekSlider.value / 100);
        vidRef.value.currentTime = seekTo;
        audioRef.value.currentTime = seekTo;
      }
    };

    watch(vidRef, (newVal) => {
      nextTick(() => {
        newVal.addEventListener("timeupdate", updateSeekSlider);
        newVal.addEventListener("timeupdate", updateAudioSeek);
      });
    });

    const updateSeekSlider = () => {
      const seekSlider = seekSliderRef.value;
      const currentTime = vidRef.value.currentTime;
      const duration = vidRef.value.duration;
      seekSlider.value = (currentTime / duration) * 100;
    };

    const updateAudioSeek = () => {
      const currentTime = vidRef.value.currentTime;
      audioRef.value.currentTime = currentTime;
    };

    const stopAudio = () => {
      if (audioRef.value !== null) {
        audioRef.value.pause();
        audioRef.value.currentTime = 0;
      }
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
      const maxCharacters = 35;
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
      vidSeek,
      play,
      pause,
      videoFavorite,
      seekSliderRef,
      currentVideoId,
      audioRef,
      handleVideoId,
      togglePlay,
      handleErrorMessage,
      toggleSocialMedia,
      toggleComment,
      handleShareClicked,
      showFullTitle,
      shortTitle,
      toggleFullTitle,
      stopAudio,
    };
  },
};
</script>

<style scoped>
.video {
  width: 100%;
  height: 100%;
}
.seek {
  position: absolute;
  bottom: 57px;
  height: 2px;
  width: 100%;
  z-index: 200;
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
input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  cursor: pointer;
}
input[type="range"]:hover::-webkit-slider-thumb {
  background-color: white;
  height: 12px;
  width: 12px;
  border-radius: 12px;
  opacity: 1;
}
input[type="range"]::-webkit-slider-thumb {
  opacity: 0;
  cursor: pointer;
  -webkit-appearance: none;
}
</style>
