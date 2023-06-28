<template>
  <div class="relative w-full h-full flex flex-col items-center justify-center">
    <i class="fa-solid fa-circle-xmark" @click="goBack"></i>
    <div class="card">
      <h1 class="mb-10 text-2xl font-semibold text-secondary-200">
        Upload Video
      </h1>
      <div class="w-full flex flex-col items-center">
        <section class="video-container">
          <label class="select-video-label" for="image-input"
            >Select Video

            <input
              type="file"
              id="image-input"
              accept="image/png, image/jpg"
              class="bg-secondary-100"
              @change="handleFileName"
            />
          </label>
          <div id="videoName">
            <p class="p-0">{{ videoName }}</p>
          </div>
        </section>
        <section class="flex w-5/6 h-22 justify-between my-8">
          <div>
            <input type="radio" id="later" value="later" v-model="picked" />
            <label for="later" class="text-primary-200 pl-1 text-xs relative">
              Post Later
            </label>
          </div>
          <div>
            <input type="radio" id="now" value="now" v-model="picked" />
            <label for="now" class="text-primary-200 pl-1 text-xs relative">
              Post Now
            </label>
          </div>
        </section>
        <section v-if="picked === 'now'">
          <div>
            <p class="text-primary-100">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore
              molestias at magni, voluptates quo exercitationem accusantium,
              porro nam ad molestiae, quae nisi quas aspernatur? Fugit eaque
              debitis architecto porro cumque.
            </p>
          </div>
        </section>
        <div class="self-end mt-4">
          <button class="continueButton">Continue</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onUnmounted, nextTick, watch } from "vue";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default {
  name: "UploadVideoCard",

  setup() {
    const displayVideo = ref("");
    const videoName = ref("");
    const picked = ref("later");

    const handleFileName = (e) => {
      const inputVideo = e.target.files[0];
      videoName.value = inputVideo.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        displayVideo.value = reader.result;
      };
      reader.readAsDataURL(inputVideo);
    };

    return {
      displayVideo,
      videoName,
      picked,
      handleFileName,
    };
  },
};
</script>

<style scoped>
.video-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 15px;
}

#image-input {
  display: none;
}

.video-container > label {
  font-size: 14px;
  cursor: pointer;
  justify-self: left;
  background-color: #ba2f74;
  color: #d1d5db;
  padding: 5px 10px;
  border-radius: 6px;
}

input {
  accent-color: #ba2f74;
}

#videoName {
  display: flex;
  align-items: center;
  width: 55%;
  overflow-y: scroll;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#videoName::-webkit-scrollbar {
  width: 0;
}

#videoName p {
  font-size: 14px;
  color: #e67cb1;
}

#display-image {
  width: 240px;
  height: 240px;
  border: 1px solid #51555e;
  margin-top: 20px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cropper-container {
  width: 100%;
  height: 100%;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
