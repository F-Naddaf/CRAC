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
        class="text-sm text-label -mt-1 ml-2"
        style="text-shadow: 0.5px 0.5px #262626"
      >
        {{ video.title }}
      </p>
    </div>
    <div class="absolute bottom-20 right-4 z-30">
      <SideNav
        @shareClicked="toggleSocialMedia"
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
import { ref, reactive, onMounted } from "vue";
import SideNav from "@/components/home/SideNav.vue";

export default {
  name: "Video",
  props: {
    video: Object,
  },
  components: {
    SideNav,
  },
  setup(props, { emit }) {
    const error = ref("");
    const vidRef = ref(null);
    const showError = ref(false);

    const state = reactive({
      playing: false,
    });

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
      emit("video-clicked", props.video._id);
    };

    const handleErrorMessage = (value) => {
      error.value = value;
      showError.value = true;
      setTimeout(() => {
        showError.value = false;
      }, 2000);
    };

    const toggleSocialMedia = () => {
      emit("shareClicked");
    };

    return {
      vidRef,
      error,
      state,
      showError,
      play,
      pause,
      togglePlay,
      handleErrorMessage,
      toggleSocialMedia,
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
