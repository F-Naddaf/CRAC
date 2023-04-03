<template>
  <div>
    <i class="fa-solid fa-circle-xmark" @click="goBack"></i>
    <p class="recording" v-if="recording">Recording... {{ timeRemaining }}</p>
    <div class="time-container">
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
      class="w-screen h-screen"
      id="video"
      autoplay
    ></video>
    <button
      type="button"
      id="startRecord"
      v-if="cameraEnabled"
      class="flex items-center justify-center w-12 h-12 rounded-full border-4 border-primary-100"
      @click="startRecording"
    >
      <span class="bg-primary-100 w-7 h-7 rounded-full"></span>
    </button>
    <button
      type="button"
      id="stopRecord"
      v-else
      class="flex items-center justify-center w-12 h-12 rounded-full border-4 border-yellow-600"
      @click="stopRecording"
    >
      <span class="bg-yellow-600 w-6 h-6"></span>
    </button>
  </div>
</template>

<script>
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
    };
  },
  mounted() {
    this.toggleCamera();
  },
  methods: {
    goBack() {
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
        this.blob.push(e.data);
      });
      this.mediaRecorder.start();
      this.cameraEnabled = false;
      this.recording = true;
      this.timeRemaining = this.selectedTime;
      this.timeoutID = setTimeout(this.stopRecording, this.selectedTime * 1000);
    },
    stopRecording() {
      if (this.mediaRecorder.state === "recording") {
        this.mediaRecorder.stop();
      }
      const blob = new Blob(this.blob, { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Video.mp4";
      a.click();
      this.cameraEnabled = true;
      this.recording = false;

      let remainingTime = this.selectedTime;

      const timerId = setInterval(() => {
        remainingTime -= 1;
        this.timeRemaining = remainingTime;

        if (remainingTime === 0) {
          clearInterval(timerId);
          this.mediaRecorder.stop();
          if (this.mediaRecorder.state === "recording") {
            this.mediaRecorder.stop();
            const blob = new Blob(this.blob, { type: "video/mp4" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "recording.mp4";
            a.click();
            this.cameraEnabled = true;
            this.recording = false;
          }
        }
      }, 1000);
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
  color: white;
  cursor: pointer;
  margin-left: 15px;
  padding: 5px;
  font-size: 12px;
}
.time-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
.under-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  height: 2px;
  width: 50%;
  background-color: white;
  z-index: 100;
}
#startRecord,
#stopRecord {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%);
}
.recording {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translate(-50%);
  font-size: 12px;
  color: red;
}
</style>
