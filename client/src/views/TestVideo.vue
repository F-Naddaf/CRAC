<template>
  <div class="w-full h-screen relative">
    <div class="video-wrapper">
      <div class="relative w-full h-full flex justify-center">
        <video
          class="video"
          ref="vidRef"
          @ended="stopAudio"
          @click="togglePlay"
          v-if="videoUrl !== null"
          autoPlay
          preload="metadata"
          @loadeddata="onVideoLoaded"
        >
          <source
            class="source"
            :src="videoUrl"
            type="video/mp4"
            v-show="!playing"
          />
        </video>
        <audio autoPlay v-if="audio !== null" ref="audioRef">
          <source :src="audio" type="audio/mpeg" />
        </audio>
        <input
          class="seek"
          id="seekSlid"
          type="range"
          min="0"
          max="100"
          value="0"
          step="1"
          ref="seekSliderRef"
          @input="vidSeek"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  ref,
  inject,
  reactive,
  onMounted,
  watch,
  computed,
  nextTick,
} from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "TestVideo",

  props: {
    id: String,
  },

  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const store = inject("store");
    const videoId = ref(null);
    const paramsId = ref(null);
    const currentUserId = ref(null);
    const videoUrl = ref(null);
    const audio = ref(null);

    const vidRef = ref(null);
    const audioRef = ref();
    const playing = ref(false);
    const seekSliderRef = ref(null);

    onMounted(async () => {
      await store.methods.load();
      videoId.value = route.params.id;
      paramsId.value = route.params.userId;
      currentUserId.value = store.state.userData?._id;
      await getVideo();
    });

    const getVideo = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch(
          `https://crac-server.onrender.com/api/videos/result/${videoId.value}`,
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
        videoUrl.value = video.url;
        audio.value = video.audio;
      } catch (error) {
        console.error(error);
      }
    };

    const play = () => {
      const vid = vidRef.value;
      if (vid !== null && vid !== undefined) {
        vid.play();
      }
      const audioElem = audioRef.value;
      if (audioElem !== null && audioElem !== undefined) {
        audioElem.play();
      }
      playing.value = true;
    };

    const pause = () => {
      const vid = vidRef.value;
      if (vid !== null && vid !== undefined) {
        vid.pause();
      }
      const audioElem = audioRef.value;
      if (audioElem !== null && audioElem !== undefined) {
        audioElem.pause();
      }
      playing.value = false;
    };

    const stopAudio = () => {
      const audioElem = audioRef.value;
      if (audioElem !== null && audioElem !== undefined) {
        audioElem.pause();
        audioElem.currentTime = 0;
      }
    };

    const togglePlay = () => {
      if (!playing.value) {
        pause();
      } else {
        play();
      }
      playing.value = !playing.value;
    };

    const vidSeek = () => {
      const seekSlider = seekSliderRef.value;
      if (vidRef.value && audioRef.value) {
        const seekTo = vidRef.value.duration * (seekSlider.value / 100);
        vidRef.value.currentTime = seekTo;
        audioRef.value.currentTime = seekTo;
      }
    };

    // const updateSeekSlider = () => {
    //   console.log("ccurrentTime", vidRef.value.currentTime);
    //   console.log("duration", vidRef.value.duration);
    //   const seekSlider = seekSliderRef.value;
    //   const currentTime = vidRef.value.currentTime;
    //   const duration = vidRef.value.duration;
    //   seekSlider.value = (currentTime / duration) * 100;
    // };

    const updateSeekSlider = () => {
      console.log("ccurrentTime", vidRef.value.currentTime);
      console.log("duration", vidRef.value.duration);
      const seekSlider = seekSliderRef.value;
      const vid = vidRef.value;
      if (vid && vid.duration && !isNaN(vid.duration)) {
        const currentTime = vid.currentTime;
        const duration = vid.duration;
        seekSlider.value = (currentTime / duration) * 100;
      }
    };

    const updateAudioSeek = () => {
      const currentTime = vidRef.value.currentTime;
      audioRef.value.currentTime = currentTime;
    };

    // watch(vidRef, (newVal) => {
    //   nextTick(() => {
    //     newVal.addEventListener("timeupdate", updateSeekSlider);
    //     newVal.addEventListener("timeupdate", updateAudioSeek);
    //   });
    // });

    watch(
      () => [vidRef.value, vidRef.value?.duration],
      ([newVal]) => {
        nextTick(() => {
          newVal?.addEventListener("timeupdate", updateSeekSlider);
          newVal?.addEventListener("timeupdate", updateAudioSeek);
        });
      }
    );

    const onVideoLoaded = () => {
      updateSeekSlider();
    };

    return {
      route,
      router,
      playing,
      videoId,
      paramsId,
      currentUserId,
      vidRef,
      audioRef,
      seekSliderRef,
      play,
      pause,
      stopAudio,
      videoUrl,
      audio,
      togglePlay,
      vidSeek,
      onVideoLoaded,
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
.seek {
  position: absolute;
  bottom: 57px;
  height: 2px;
  width: 100%;
  z-index: 200;
}
input[type="range"] {
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
