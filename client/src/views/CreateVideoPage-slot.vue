<!-- <template>
  <div class="relative w-full h-full">
    <i class="fa-solid fa-circle-xmark" @click="goBack"></i>
    <p class="recording" v-if="recording">Recording... {{ timeRemaining }}</p>
    <div v-if="!isPosting" class="time-container">
      <slot name="time-buttons"></slot>
    </div>
    <video
      v-if="toggleCamera"
      class="max-w-md h-screen m-auto"
      id="video"
      ref="myVideo"
      autoplay
    ></video>
    <slot name="start-record-button"></slot>
    <slot name="stop-record-button"></slot>
    <slot name="post-button"></slot>
  </div>
</template>

<script>
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { v4 as uuidv4 } from "uuid";
// import { storage } from "../firebase.js";
// import { useRouter } from "vue-router";
// import "firebase/storage";
import { onMounted, ref as toRef, inject } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "CreateVideoPage",
  props: ["isPosting"],
  setup() {
    const isPosting = inject("isPosting");
    const videoStream = toRef(null);
    const cameraEnabled = toRef(true);
    const recording = toRef(false);
    // const isPosting = toRef(false);
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
    });

    const goBack = () => {
      closeCamera();
      router.push("/home");
    };

    const closeCamera = () => {
      if (videoStream.value) {
        videoStream.value.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };

    return {
      videoStream,
      cameraEnabled,
      toggleCamera,
      goBack,
      closeCamera,
      isPosting,
      recording,
      //=====//
      //   mediaRecorder,
      //   blob,
      //   userId,
      //   selectedTime,
      //   timeoutID,
      //   timeRemaining,
      //   isRecordStop,
      //   url,
      //   title,
      //   startRecording,
      //   stopRecording,
      //   postVideo,
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
.recording {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translate(-50%);
  font-size: 12px;
  color: red;
  z-index: 1;
}
</style> -->
