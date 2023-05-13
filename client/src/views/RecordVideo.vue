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
    <button
      type="button"
      id="post"
      class="flex items-center justify-center w-20"
      v-if="isPosting"
      @click="postVideo"
    >
      <div class="flex items-center justify-evenly w-full mb-4">
        <i class="fa-solid fa-cloud-arrow-up"></i>
        <p class="text-xl text-gray-400 text-white font-bold">Post</p>
      </div>
    </button>
  </div>
</template>

<script>
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../firebase.js";
import "firebase/storage";

export default {
  name: "RecordVideo",
  data() {
    return {
      videoStream: null,
      mediaRecorder: null,
      blob: null,
      cameraEnabled: true,
      recording: false,
      selectedTime: 30,
      timeoutID: null,
      timeRemaining: 0,
      isRecordStop: false,
      isPosting: false,
      url: null,
    };
  },
  mounted() {
    this.toggleCamera();
  },
  methods: {
    goBack() {
      this.closeCamera();
      this.$router.push({ name: "HomePage" });
    },
    async toggleCamera() {
      try {
        this.videoStream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        });
        document.getElementById("video").srcObject = this.videoStream;
        this.toggleCamera = true;
      } catch (err) {
        console.error("Error accessing user media:", err);
        this.cameraEnabled = false;
      }
    },
    startRecording() {
      this.mediaRecorder = new MediaRecorder(this.videoStream);
      this.blob = [];
      this.mediaRecorder.addEventListener("dataavailable", (e) => {
        console.log("data available", e.data.size);
        this.blob.push(e.data);
      });
      this.mediaRecorder.start();
      this.isRecordStop = true;
      this.cameraEnabled = false;
      this.recording = true;
      this.timeRemaining = this.selectedTime;
      this.timeoutID = setTimeout(this.stopRecording, this.selectedTime * 1000);
      let remainingTime = this.selectedTime;
      const timerId = setInterval(() => {
        remainingTime -= 1;
        this.timeRemaining = remainingTime;
        if (remainingTime === 0) {
          clearInterval(timerId);
        }
      }, 1000);
    },

    async stopRecording() {
      const filename = uuidv4();
      const storageRef = ref(storage);
      const fileRef = ref(storageRef, "videos/" + filename);
      if (this.mediaRecorder.state === "recording") {
        clearTimeout(this.timeoutID);
        this.timeoutID = null;
        this.isRecordStop = false;
        this.isPosting = true;
        await new Promise((resolve) => {
          this.mediaRecorder.addEventListener("stop", resolve);
          this.mediaRecorder.stop();
        });
        const blob = new Blob(this.blob, { type: "videos/mp4" });
        const metadata = {
          contentType: "video/mp4",
        };
        const snapShot = await uploadBytes(fileRef, blob, metadata);
        this.url = await getDownloadURL(snapShot.ref);
        console.log("url", this.url);
        this.recording = false;
      }
    },
    closeCamera() {
      if (this.videoStream) {
        this.videoStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    },
    postVideo() {
      console.log("url", this.url);
    },
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
