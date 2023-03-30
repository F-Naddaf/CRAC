<template>
  <div>
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
      class="flex items-center justify-center w-12 h-12 rounded-full border-4 border-red-900"
      @click="recordVideo"
    ><span class="bg-red-900 w-7 h-7 rounded-full"></span></button>
    <button
      type="button"
      id="stopRecord"
      v-else
      class="flex items-center justify-center w-12 h-12 rounded-full border-4 border-yellow-600"
      @click="stopRecording"
    ><span class="bg-yellow-600 w-6 h-6"></span></button>
    <p class="recording" v-if="recording">Recording...</p>
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
    };
  },
  mounted() {
    this.toggleCamera();
  },
  methods: {
    async toggleCamera() {
      try {
        this.videoStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        document.getElementById("video").srcObject = this.videoStream;
        this.toggleCamera = true;
      } catch (err) {
        console.error("Error accessing user media:", err);
        this.cameraEnabled = false;
      }
    },
    recordVideo() {
      this.mediaRecorder = new MediaRecorder(this.videoStream);
      this.blob = [];
      this.mediaRecorder.addEventListener("dataavailable", (e) => {
        this.blob.push(e.data);
      });
      this.mediaRecorder.start();
      this.cameraEnabled = false;
      this.recording = true;
    },
    stopRecording() {
      this.mediaRecorder.stop();
      const blob = new Blob(this.blob, { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.mp4";
      a.click();
      this.cameraEnabled = true;
      this.recording = false;
    },
  },
};
</script>

<style scoped>
video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
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
