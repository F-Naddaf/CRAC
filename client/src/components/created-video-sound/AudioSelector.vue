<template>
  <div class="music-wrapper">
    <h1 class="mb-2 text-xl font-semibold text-secondary-200">
      Choose your audio type
    </h1>

    <section class="flex w-5/6 h-22 justify-between my-3">
      <div>
        <input type="radio" id="original" value="Original" v-model="picked" />
        <label for="original" class="text-primary-200 pl-1 relative">
          Original
        </label>
      </div>
      <div>
        <input type="radio" id="mute" value="Mute" v-model="picked" />
        <label for="mute" class="text-primary-200 pl-1 relative"> Mute </label>
      </div>
    </section>
    <section class="w-full">
      <div v-for="song in allSongs" :key="song._id" class="music-card">
        <input
          type="radio"
          :id="song._id"
          :value="song._id"
          v-model="picked"
          class="-ml-1"
        />
        <div
          class="absolute flex h-16 w-16 left-8 items-center justify-start border-2 border-gray-200 rounded-full overflow-hidden"
        >
          <img :src="song.image" />
        </div>
        <div class="music-details">
          <div
            class="flex flex-col justify-center w-32 h-full overflow-hidden ml-2 mr-2"
          >
            <p class="text-gray-300 text-xs">Title</p>
            <p
              v-if="song.title.length > 12"
              class="text-primary-200 text-sm font-semibold"
            >
              {{ song.title.slice(0, 12) + "..." }}
            </p>
            <p v-else class="text-primary-200 text-sm font-semibold">
              {{ song.title }}
            </p>
          </div>
          <div class="flex flex-col justify-center h-full overflow-hidden">
            <p class="text-gray-300 text-xs">Singer</p>
            <p
              v-if="song.singerName.length > 13"
              class="text-primary-200 text-sm font-semibold"
            >
              {{ song.singerName.slice(0, 12) + "..." }}
            </p>
            <p v-else class="text-primary-200 text-sm font-semibold">
              {{ song.singerName }}
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
          <audio
            :src="currentSong ? currentSong.url : ''"
            ref="audioPlayer"
          ></audio>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { onMounted, ref, watchEffect } from "vue";

export default {
  name: "AudioSelector",

  setup() {
    const allSongs = ref([]);
    const picked = ref("Mute");
    const currentSong = ref(null);
    const audioPlayer = ref(null);

    onMounted(async () => {
      await getAllSongs();
    });

    const getAllSongs = async () => {
      try {
        const response = await fetch(`http://localhost:6500/api/music`);
        const json = await response.json();
        allSongs.value = json.songs;
      } catch (error) {
        console.log(error);
      }
    };

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
        audioPlayer.value.addEventListener("loadeddata", () => {
          audioPlayer.value.play();
        });
      }
    };

    const isSongPlaying = (song) => {
      return song === currentSong.value;
    };

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

    return {
      allSongs,
      picked,
      currentSong,
      audioPlayer,
      getAllSongs,
      isSongPlaying,
      toggleSong,
    };
  },
};
</script>

<style scoped>
.music-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  height: auto;
  max-height: 100%;
  padding-top: 8px;
  overflow: auto;
  border: 1px solid #d1d5db;
  border-radius: 10px;
}
.music-wrapper::-webkit-scrollbar {
  display: none;
}
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
  /* justify-content: space-between; */
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
