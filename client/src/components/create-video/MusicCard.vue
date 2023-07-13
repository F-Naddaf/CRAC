<template>
  <div class="music-card">
    <input
      type="radio"
      :id="id"
      :value="title"
      :image="image"
      :url="url"
      v-model="pickedSong"
      class="-ml-1"
    />
    <div
      class="absolute flex h-16 w-16 left-8 items-center justify-start border-2 border-gray-200 rounded-full overflow-hidden"
    >
      <img :src="image" />
    </div>
    <div class="music-details">
      <div
        class="flex flex-col justify-center w-32 h-full overflow-hidden ml-2 mr-2"
      >
        <p class="text-gray-300 text-xs">Title</p>
        <p
          v-if="title.length > 12"
          class="text-primary-200 text-sm font-semibold"
        >
          {{ title.slice(0, 12) + "..." }}
        </p>
        <p v-else class="text-primary-200 text-sm font-semibold">
          {{ title }}
        </p>
      </div>
      <div class="flex flex-col justify-center h-full overflow-hidden">
        <p class="text-gray-300 text-xs">Singer</p>
        <p
          v-if="singerName.length > 13"
          class="text-primary-200 text-sm font-semibold"
        >
          {{ singerName.slice(0, 12) + "..." }}
        </p>
        <p v-else class="text-primary-200 text-sm font-semibold">
          {{ singerName }}
        </p>
      </div>
      <button @click="toggleSong(song)" class="absolute right-2">
        <i
          :class="[
            'fa-solid fa-circle-play',
            { 'fa-solid fa-circle-stop': isSongPlaying(song) },
          ]"
        ></i>
      </button>
      <audio :src="currentSong ? url : ''" ref="audioPlayer"></audio>
    </div>
  </div>
</template>

<script>
import { ref, watch, watchEffect, onUnmounted, onMounted } from "vue";

export default {
  name: "MusicCard",
  props: {
    songs: Array,
    id: String,
    title: String,
    image: String,
    url: String,
    singerName: String,
  },
  setup(props, { emit }) {
    const audioPlayer = ref(null);
    const currentSong = ref(null);
    const pickedSong = ref(null);
    let emitTimeout = null;

    onMounted(() => {
      console.log("props.song", props.songs);
    });

    const toggleSong = (song) => {
      if (isSongPlaying(song)) {
        audioPlayer.value.pause();
        currentSong.value = null;
      } else {
        currentSong.value = song;
        if (
          audioPlayer.value &&
          typeof audioPlayer.value.pause === "function"
        ) {
          audioPlayer.value.pause();
        }
        audioPlayer.value = new Audio(song.url);
      }
      emit("picked", pickedSong);
    };

    const isSongPlaying = (song) => {
      console.log("play", song);
      return song === song;
    };

    const emitSelectedValue = () => {
      clearTimeout(emitTimeout);
      if (currentSong.value) {
        audioPlayer.value.pause();
        currentSong.value = null;
      }
      emit("update:selectedValue", pickedSong.value);
      emit("update:selectedSongUrl", getSelectedSongUrl());
      emit("selectedSongImage", getSelectedSongImage());
      emitTimeout = setTimeout(() => {
        emit("close-clicked");
      }, 1500);
    };

    // const getSelectedSongUrl = () => {
    //   const getSong = props.songs.value.find(
    //     (s) => s.title === pickedSong.value
    //   );
    //   console.log("getSong", getSong);
    //   return getSong ? getSong.url : null;
    // };

    // const getSelectedSongImage = () => {
    //   const getSong = props.songs.value.find(
    //     (s) => s.title === pickedSong.value
    //   );
    //   const image = getSong ? getSong.image : null;
    //   return image;
    // };

    watch(pickedSong, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        if (newValue === "Mute" || newValue === "Original") {
          if (currentSong.value) {
            audioPlayer.value.pause();
            currentSong.value = null;
          }
          emitSelectedValue();
        } else {
          //   const findSong = props.songs.find((s) => s.title === newValue);
          //   console.log("findSong", findSong);
          toggleSong(song);
          emitSelectedValue();
        }
      }
    });

    watchEffect(() => {
      const newSong = currentSong.value;
      if (newSong) {
        if (
          audioPlayer.value &&
          typeof audioPlayer.value.pause === "function"
        ) {
          audioPlayer.value.pause();
          audioPlayer.value = null;
        }

        audioPlayer.value = new Audio(newSong.url);
        audioPlayer.value.addEventListener("loadeddata", () => {
          audioPlayer.value.play();
        });
      } else if (
        audioPlayer.value &&
        typeof audioPlayer.value.pause === "function"
      ) {
        audioPlayer.value.pause();
        audioPlayer.value = null;
      }
    });

    onUnmounted(() => {
      clearTimeout(emitTimeout);
    });

    return {
      audioPlayer,
      currentSong,
      pickedSong,
      emitTimeout,
      toggleSong,
      isSongPlaying,
      emitSelectedValue,
      //   getSelectedSongUrl,
      //   getSelectedSongImage,
    };
  },
};
</script>

<style scoped>
input {
  accent-color: #ba2f74;
}
img {
  object-fit: cover;
}
.music-details {
  margin-left: 60px;
  width: 75%;
  display: flex;
  height: 3.5rem;
  align-items: center;
}
button i {
  color: #d1d5db;
}
button i.text-white {
  color: #167199;
}
.fa-circle-play {
  color: white;
  font-size: 22px;
  background-color: #167199;
  border: 1px solid #167199;
  border-radius: 50%;
}
.fa-circle-stop {
  color: white;
  font-size: 22px;
  background-color: #ba2f74;
  border: 1px solid #ba2f74;
  border-radius: 50%;
}
</style>
