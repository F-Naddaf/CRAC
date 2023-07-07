<template>
  <div class="relative w-full h-full">
    <i class="fa-solid fa-circle-xmark" @click="goBack"></i>
    <p class="recording" v-if="recording">{{ timeRemaining }}</p>
    <div v-if="!selectedValue" class="audio-btn">
      <button @click="handleShowAudio">
        <i class="fa-solid fa-music text-xs text-gray-300"></i>
        <p class="text-gray-300 text-xs">Add Sound</p>
      </button>
    </div>
    <div v-if="selectedValue" class="audio-btn">
      <p class="text-primary-100 text-xs font-bold">
        Sound: {{ selectedValue.slice(0, 8) + "..." }}
      </p>
    </div>
    <div class="music-container" v-if="showAudioCard">
      <AudioSelector
        v-model="selectedValue"
        :showAudio="showAudioCard"
        @update:selectedValue="updateSelectedValue"
        @closeClicked="handleCloseAudio"
        @update:selectedSongUrl="updategetSelectedSongUrl"
        @selectedSongImage="updateSelectedSongImage"
      />
    </div>
    <div v-if="!selectedValue" class="time-container">
      <button class="time-btn" @click="selectedTime = 30">
        30 Sec
        <span v-if="selectedTime === 30" class="under-line"></span>
      </button>
      <button class="time-btn" @click="selectedTime = 60">
        60 Sec
        <span v-if="selectedTime === 60" class="under-line"></span>
      </button>
      <button class="time-btn" @click="selectedTime = 90">
        90 Sec
        <span v-if="selectedTime === 90" class="under-line"></span>
      </button>
    </div>
    <video
      v-if="toggleCamera"
      class="max-w-md h-screen m-auto"
      id="video"
      ref="myVideo"
      autoplay
    ></video>
    <div v-if="recording">
      <audio autoplay>
        <source :src="getSelectedSongUrl" type="audio/mpeg" />
      </audio>
    </div>
    <button
      type="button"
      id="startRecord"
      v-if="cameraEnabled"
      class="flex items-center justify-center w-11 h-11 rounded-full border-2 border-primary-100"
      @click="startRecording"
    >
      <span class="bg-primary-100 w-6 h-6 rounded-full"></span>
    </button>
    <button
      type="button"
      id="stopRecord"
      v-if="isRecordStop"
      class="flex items-center justify-center w-11 h-11 rounded-full border-2 border-primary-100"
      @click="stopRecording"
    >
      <span class="bg-gray-400 w-4 h-4 rounded-sm"></span>
    </button>
    <div
      type="button"
      id="post"
      class="flex items-center justify-center w-20"
      v-if="isPosting"
    >
      <div class="flex flex-col items-center justify-evenly w-full mb-4">
        <div class="flex items-center justify-between w-full mb-2">
          <button class="post-btn" @click="postLater">Later</button>
          <button class="post-btn" @click="postNow">Now</button>
        </div>
        <div class="flex items-center justify-between">
          <i class="fa-solid fa-cloud-arrow-up pr-2"></i>
          <p class="text-xl text-gray-400 text-white font-bold">Post</p>
        </div>
      </div>
    </div>
    <button
      v-if="!cameraIsOpen"
      class="absolute bottom-6 right-10 flex flex-col items-center"
      @click="taggleUploadVideo"
    >
      <i class="fa-solid fa-film text-secondary-200 text-xl m-0"></i>
      <p class="text-secondary-200 text-xs font-bold">Upload</p>
    </button>
    <div class="video-container" v-if="showUploadVideo">
      <UploadVideoCard
        :userId="userId"
        :userImage="userImage"
        :username="username"
        @closeUpload="closeUpload"
      />
    </div>
    <MediaTitle
      v-if="showModel"
      @close="close"
      :close="close"
      :url="url"
      :userId="userId"
      :userImage="userImage"
      :username="username"
      :closeCamera="closeCamera"
      :getSelectedSongUrl="getSelectedSongUrl"
      :getSongImage="getSongImage"
    />
  </div>
</template>

<script>
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase.js";
import { onMounted, ref as toRef, inject, computed, watch } from "vue";
import { useRouter } from "vue-router";
import "firebase/storage";
import MediaTitle from "../components/MediaTitle.vue";
import AudioSelector from "../components/create-video/AudioSelector.vue";
import UploadVideoCard from "../components/create-video/UploadVideoCard.vue";

export default {
  name: "CreateVideoPage",

  components: {
    AudioSelector,
    MediaTitle,
    UploadVideoCard,
  },

  setup() {
    const router = useRouter();
    const store = inject("store");
    const userId = computed(() => store.state.userData?._id);
    const userImage = computed(() => store.state.userData?.userImage);
    const username = computed(() => store.state.userData?.username);
    const videoStream = toRef(null);
    const mediaRecorder = toRef(null);
    const blob = toRef(null);
    const cameraEnabled = toRef(true);
    const recording = toRef(false);
    const selectedTime = toRef(30);
    const timeoutID = toRef(null);
    const timeRemaining = toRef(0);
    const isRecordStop = toRef(false);
    const isPosting = toRef(false);
    const url = toRef("");
    const toPost = toRef(false);
    const showModel = toRef(false);
    const selectedValue = toRef(null);
    const showAudioCard = toRef(false);
    const showUploadVideo = toRef(false);
    const getSelectedSongUrl = toRef("");
    const getSongImage = toRef("");
    const cameraIsOpen = toRef(false);
    const existVideo = toRef(false);

    const toggleCamera = async () => {
      if (selectedValue.value !== null && selectedValue.value !== "") {
        try {
          if (selectedValue.value === "Original") {
            videoStream.value = await navigator.mediaDevices.getUserMedia({
              audio: true,
              video: true,
            });
          } else {
            videoStream.value = await navigator.mediaDevices.getUserMedia({
              audio: false,
              video: true,
            });
          }
          document.getElementById("video").srcObject = videoStream.value;
          cameraEnabled.value = true;
          cameraIsOpen.value = true;
        } catch (err) {
          console.error("Error accessing user media:", err);
          cameraEnabled.value = false;
        }
      }
    };

    onMounted(() => {
      store.methods.load();
    });

    const updateSelectedValue = (value) => {
      selectedValue.value = value;
      toggleCamera();
    };

    const handleShowAudio = () => {
      showAudioCard.value = true;
    };

    const taggleUploadVideo = () => {
      showUploadVideo.value = true;
    };

    const updategetSelectedSongUrl = (url) => {
      getSelectedSongUrl.value = url;
    };

    const updateSelectedSongImage = (url) => {
      getSongImage.value = url;
    };

    const handleCloseAudio = () => {
      showAudioCard.value = false;
    };

    const goBack = async () => {
      if (isRecordStop.value === true) {
        await stopRecording();
      }
      try {
        if (existVideo) {
          const storageRef = ref(storage);
          const videosRef = ref(storageRef, "videos/");

          const { items } = await listAll(videosRef);

          if (items.length > 0) {
            const { highestNumber, fileToDelete } =
              findVideoWithHighestNumber(items);

            if (fileToDelete) {
              const fileRef = ref(storageRef, fileToDelete.fullPath);
              await deleteObject(fileRef);
            }
          }
          closeCamera();
          router.go(-1);
        } else {
          closeCamera();
          router.go(-1);
        }
      } catch (error) {
        console.error("Error deleting video:", error);
      }
    };

    const findVideoWithHighestNumber = (items) => {
      const numbers = items.map((item) => {
        const match = item.name.match(/video-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });
      const highestNumber = Math.max(...numbers);
      const fileToDelete = items.find((item) => {
        const match = item.name.match(/video-(\d+)/);
        const number = match ? parseInt(match[1]) : 0;
        return number === highestNumber;
      });
      return { highestNumber, fileToDelete };
    };

    const startRecording = () => {
      mediaRecorder.value = new MediaRecorder(videoStream.value);
      blob.value = [];
      mediaRecorder.value.addEventListener("dataavailable", (e) => {
        blob.value.push(e.data);
      });
      mediaRecorder.value.start();
      isRecordStop.value = true;
      cameraEnabled.value = false;
      recording.value = true;
      timeRemaining.value = selectedTime.value;
      timeoutID.value = setTimeout(stopRecording, selectedTime.value * 1000);
      let remainingTime = selectedTime.value;
      const timerId = setInterval(() => {
        remainingTime -= 1;
        timeRemaining.value = remainingTime;
        if (remainingTime === 0) {
          clearInterval(timerId);
        }
      }, 1000);
    };

    const stopRecording = async () => {
      const storageRef = ref(storage);
      const videosRef = ref(storageRef, "videos/");
      const { items } = await listAll(videosRef);
      let highestNumber = 0;
      let newFileName;

      if (items.length > 0) {
        const { highestNumber: maxNumber } = findVideoWithHighestNumber(items);
        highestNumber = maxNumber;
        newFileName = `video-${highestNumber + 1}`;
      } else {
        newFileName = "video-1";
      }

      if (items.length === 0 || mediaRecorder.value.state === "recording") {
        const newVideosRef = ref(storageRef, "videos/" + newFileName);
        clearTimeout(timeoutID.value);
        timeoutID.value = null;
        isRecordStop.value = false;
        isPosting.value = true;
        await new Promise((resolve) => {
          mediaRecorder.value.addEventListener("stop", resolve);
          mediaRecorder.value.stop();
        });
        blob.value = new Blob(blob.value, { type: "videos/mp4" });
        const metadata = {
          contentType: "video/mp4",
        };
        const snapShot = await uploadBytes(newVideosRef, blob.value, metadata);
        url.value = await getDownloadURL(snapShot.ref);
        recording.value = false;
        isPosting.value = true;
        existVideo.value = true;
      }
    };

    const closeCamera = () => {
      if (videoStream.value) {
        videoStream.value.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };

    const close = () => {
      showModel.value = false;
    };

    const closeUpload = () => {
      showUploadVideo.value = false;
    };

    const postNow = () => {
      showModel.value = true;
      toPost.value = true;
    };

    const postLater = async () => {
      toPost.value = false;
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch(
          "http://localhost:6500/api/videos/postLater",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId: userId.value,
              userImage: userImage.value,
              username: username.value,
              media: { title: "", url: url.value, posted: toPost.value },
              audio: getSelectedSongUrl.value,
              songImage: getSongImage.value,
            }),
          }
        );
        const json = await response.json();
        if (json.success) {
          closeCamera();
          router.push({
            name: "Profile",
            params: { id: userId.value },
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    return {
      videoStream,
      mediaRecorder,
      blob,
      cameraEnabled,
      recording,
      userId,
      userImage,
      username,
      url,
      toPost,
      showAudioCard,
      selectedTime,
      timeoutID,
      timeRemaining,
      isRecordStop,
      isPosting,
      showModel,
      cameraIsOpen,
      selectedValue,
      existVideo,
      store,
      goBack,
      toggleCamera,
      startRecording,
      stopRecording,
      closeCamera,
      postNow,
      postLater,
      close,
      updateSelectedValue,
      updategetSelectedSongUrl,
      updateSelectedSongImage,
      getSelectedSongUrl,
      handleShowAudio,
      handleCloseAudio,
      taggleUploadVideo,
      showUploadVideo,
      closeUpload,
      getSongImage,
    };
  },
};
</script>

<style scoped>
.music-container {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 40px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 150;
}
.video-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-top: 40px;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 150;
}
.audio-btn {
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}
.audio-btn button {
  display: flex;
  align-items: center;
  background-color: #ba2f74;
  padding: 2px 5px;
  border-radius: 4px;
}
.audio-btn button p {
  padding-left: 8px;
}
.fa-circle-xmark {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #51555e;
  font-size: 20px;
  z-index: 10;
}
.fa-circle-xmark:hover {
  cursor: pointer;
  color: #e67cb1;
}
video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.time-container {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translate(-50%);
  z-index: 20;
}
.time-btn {
  position: relative;
  color: #e67cb1;
  text-shadow: 0.5px 0.5px #ba2f74;
  cursor: pointer;
  margin-left: 15px;
  padding: 5px;
  font-size: 12px;
}
.post-btn {
  position: relative;
  color: rgb(156 163 175);
  cursor: pointer;
  padding: 5px;
  font-size: 12px;
}
.post-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
.under-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  height: 2px;
  width: 50%;
  background-color: #e67cb1;
  box-shadow: 0.5px 0.5px #ba2f74;
  z-index: 100;
}
#startRecord,
#stopRecord,
#post {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%);
}
.fa-cloud-arrow-up {
  color: #e67cb1;
  font-size: 18px;
}
.recording {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 12px;
  right: 12px;
  border: 2px solid #ba2f74;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 700;
  color: #ba2f74;
  z-index: 1;
}
</style>
