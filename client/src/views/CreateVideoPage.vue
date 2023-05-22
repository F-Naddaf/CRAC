<template>
  <div class="relative w-full h-full">
    <i class="fa-solid fa-circle-xmark" @click="goBack"></i>
    <p class="recording" v-if="recording">Recording... {{ timeRemaining }}</p>
    <div v-if="!isPosting" class="time-container">
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
    <button
      type="button"
      id="startRecord"
      v-if="cameraEnabled"
      class="flex items-center justify-center w-11 h-11 rounded-full border-2 border-red-700"
      @click="startRecording"
    >
      <span class="bg-red-700 w-6 h-6 rounded-full"></span>
    </button>
    <button
      type="button"
      id="stopRecord"
      v-if="isRecordStop"
      class="flex items-center justify-center w-11 h-11 rounded-full border-2 border-red-700"
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
    <MediaTitle
      v-if="showModel"
      @close="close"
      :close="close"
      :url="url"
      :userId="userId"
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
import { onMounted, ref as toRef, inject, computed } from "vue";
import { useRouter } from "vue-router";
import "firebase/storage";
import MediaTitle from "../components/MediaTitle.vue";

export default {
  name: "CreateVideoPage",

  components: {
    MediaTitle,
  },

  setup() {
    const store = inject("store");
    const userId = computed(() => store.state.userData?._id);
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
    const title = toRef("");
    const url = toRef("");
    const showModel = toRef(false);
    const router = useRouter();

    const toggleCamera = async () => {
      try {
        videoStream.value = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        });
        document.getElementById("video").srcObject = videoStream.value;
        cameraEnabled.value = true;
      } catch (err) {
        console.error("Error accessing user media:", err);
        cameraEnabled.value = false;
      }
    };

    onMounted(() => {
      toggleCamera();
      store.methods.load();
    });

    const goBack = async () => {
      if (isRecordStop.value === true) {
        await stopRecording();
      }
      try {
        const storageRef = ref(storage);
        const videosRef = ref(storageRef, "videos/");

        const { items } = await listAll(videosRef);

        if (items.length > 0) {
          const { highestNumber, fileToDelete } =
            findVideoWithHighestNumber(items);

          if (fileToDelete) {
            const fileRef = ref(storageRef, fileToDelete.fullPath);
            await deleteObject(fileRef);
            console.log("Last recorded video deleted successfully");
          } else {
            console.log("No videos found with the highest number");
          }
        } else {
          console.log("No videos found in storage");
        }

        closeCamera();
        router.push("/home");
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

    const postNow = () => {
      showModel.value = true;
    };

    const postLater = async () => {
      goBack();
      // showModel.value = true;
      // const token = localStorage.getItem("accessToken");
      // try {
      //   const response = await fetch("http://localhost:6500/api/users/media", {
      //     method: "PATCH",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //     body: JSON.stringify({
      //       id: userId.value,
      //       media: { title: title.value, url: url.value },
      //     }),
      //   });
      //   const json = await response.json();
      //   if (json.success) {
      //     goBack();
      //   }
      // } catch (error) {
      //   console.error(error);
      // }
    };

    return {
      videoStream,
      mediaRecorder,
      blob,
      cameraEnabled,
      recording,
      userId,
      url,
      selectedTime,
      timeoutID,
      timeRemaining,
      isRecordStop,
      isPosting,
      title,
      showModel,
      store,
      goBack,
      toggleCamera,
      startRecording,
      stopRecording,
      closeCamera,
      postNow,
      postLater,
      close,
    };
  },
};
</script>

<style scoped>
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
  color: rgb(156 163 175);
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
  background-color: rgb(156 163 175);
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
  top: 20px;
  left: 50%;
  transform: translate(-50%);
  font-size: 12px;
  color: red;
  z-index: 1;
}
</style>
