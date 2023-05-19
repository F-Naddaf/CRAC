<!-- <template>
  <CreateVideoPage :isPosting="isPosting">
    <!-- Timer buttons -->
    <template #time-buttons>
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
    </template>

    <!-- Start recording button -->
    <template #start-record-button>
      <button
        type="button"
        id="startRecord"
        v-if="cameraEnabled"
        class="flex items-center justify-center w-11 h-11 rounded-full border-2 border-red-700"
        @click="startRecording"
      >
        <span class="bg-red-700 w-6 h-6 rounded-full"></span>
      </button>
    </template>

    <!-- Stop recording button -->
    <template #stop-record-button>
      <button
        type="button"
        id="stopRecord"
        v-if="isRecordStop"
        class="flex items-center justify-center w-11 h-11 rounded-full border-2 border-red-700"
        @click="stopRecording"
      >
        <span class="bg-gray-400 w-4 h-4 rounded-sm"></span>
      </button>
    </template>

    <!-- Post button -->
    <template #post-button>
      <div
        type="button"
        id="post"
        class="flex items-center justify-center w-20"
        v-if="isPosting"
      ></div>
    </template>
  </CreateVideoPage>
</template>

<script>
// import { onMounted, inject } from "vue";

import CreateVideoPage from "../views/CreateVideoPage.vue";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../firebase.js";
import { onMounted, ref as toRef, computed, provide, reactive } from "vue";
import "firebase/storage";

export default {
  name: "VideoRecorder",
  components: {
    CreateVideoPage,
  },
  setup() {
    const propState = reactive({
      isPosting: isPosting,
    });
    provide("isPosting", state.isPosting);
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
    const url = toRef(null);
    const title = toRef("");

    onMounted(() => {
      store.methods.load();
    });

    const startRecording = () => {
      if (!videoStream.value) {
        console.error("Video stream not available.");
        return;
      }
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
      const filename = uuidv4();
      const storageRef = ref(storage);
      const fileRef = ref(storageRef, "videos/" + filename);
      if (mediaRecorder.value.state === "recording") {
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
        const snapShot = await uploadBytes(fileRef, blob.value, metadata);
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

    const postVideo = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch("http://localhost:6500/api/users/media", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: userId.value,
            media: { title: title.value, url: url.value },
          }),
        });
        const json = await response.json();
        if (json.success) {
          //   goBack();
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
      selectedTime,
      timeoutID,
      timeRemaining,
      isRecordStop,
      isPosting,
      url,
      title,
      goBack,
      toggleCamera,
      startRecording,
      stopRecording,
      closeCamera,
      postVideo,
    };
  },
};
</script>

<style scoped>
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
</style> -->
