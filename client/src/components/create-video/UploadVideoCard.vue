<template>
  <div class="relative w-full h-full flex flex-col items-center justify-center">
    <div class="card mt-16">
      <h1 class="text-2xl font-semibold text-secondary-200">Upload Video</h1>
      <p class="text-gray-300 text-xs my-6">
        Please Select a video under 10 minutes.
      </p>
      <div class="w-full flex flex-col items-center">
        <section class="video-container">
          <label class="select-video-label" for="image-input"
            >Select Video

            <input
              type="file"
              id="image-input"
              accept="video/*"
              class="bg-secondary-100"
              ref="fileInput"
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
        <section v-if="picked === 'now'" class="w-full">
          <FormInput
            v-for="(input, index) in inputs"
            :key="index"
            :label="input.label"
            :type="input.type"
            v-model="input.value"
            @update:value="input.value = $event"
          />
        </section>
        <div v-if="uploading">
          <p class="text-secondary-200 text-xs">Please wait...</p>
        </div>
        <div v-else>
          <p class="succes-message">{{ success }}</p>
          <p class="faild-message">{{ faild }}</p>
        </div>
        <div class="w-full flex mt-4 justify-between">
          <button @click="$emit('closeUpload')" class="cancelButton">
            Cancel
          </button>
          <button @click="handleSubmit" class="continueButton">Continue</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref as varRef } from "vue";
import FormInput from "../FormInput.vue";
import { useRouter } from "vue-router";
import "firebase/storage";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  getStorage,
} from "firebase/storage";

export default {
  name: "UploadVideoCard",

  components: {
    FormInput,
  },
  props: {
    userId: String,
    userImage: String,
    username: String,
  },

  setup(props) {
    const router = useRouter();
    const inputs = varRef({
      media: {
        label: "Title",
        value: "",
        type: "text",
      },
    });
    const displayVideo = varRef("");
    const videoName = varRef("");
    const picked = varRef("later");
    const url = varRef("");
    const toPost = varRef(false);
    const fileInput = varRef(null);
    const success = varRef("");
    const faild = varRef("");
    const uploading = varRef(false);

    const handleFileName = (e) => {
      const inputVideo = e.target.files[0];
      const maxDuration = 600;
      const videoElement = document.createElement("video");
      videoElement.src = URL.createObjectURL(inputVideo);

      videoElement.addEventListener("loadedmetadata", () => {
        const duration = videoElement.duration;
        if (duration > maxDuration) {
          videoName.value = "The video is to larg";
        } else {
          videoName.value = inputVideo.name;
        }
      });
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

    const storeVideo = async () => {
      const storage = getStorage();
      const storageRef = ref(storage);
      const videosRef = ref(storageRef, "videos/");
      const videoFile = fileInput.value.files[0];
      const { items } = await listAll(videosRef);
      let highestNumber = 0;
      let newFileName;
      const metadata = {
        contentType: "video/mp4",
      };

      if (items.length > 0) {
        const { highestNumber: maxNumber } = findVideoWithHighestNumber(items);
        highestNumber = maxNumber;
        newFileName = `video-${highestNumber + 1}`;
      } else {
        newFileName = "video-1";
      }
      const newVideosRef = ref(storageRef, "videos/" + newFileName);
      const snapShot = await uploadBytes(newVideosRef, videoFile, metadata);
      url.value = await getDownloadURL(snapShot.ref);
    };

    const handleSubmit = async () => {
      uploading.value = true;
      await storeVideo();
      if (picked.value === "later") {
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
                userId: props.userId,
                userImage: props.userImage,
                username: props.username,
                media: { title: "", url: url.value, posted: toPost.value },
              }),
            }
          );
          const json = await response.json();
          if (json.success) {
            uploading.value = false;
            success.value = json.message;
            setTimeout(() => {
              router.push({
                name: "Profile",
                params: { id: props.userId },
              });
            }, 1500);
          } else {
            uploading.value = false;
            faild.value = json.message;
          }
        } catch (error) {
          console.error(error);
        }
      } else if (picked.value === "now") {
        toPost.value = true;
        const token = localStorage.getItem("accessToken");
        try {
          const response = await fetch(
            "http://localhost:6500/api/videos/postVideo",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                userId: props.userId,
                userImage: props.userImage,
                username: props.username,
                media: {
                  title: inputs.value.media.value,
                  url: url.value,
                  posted: toPost.value,
                },
              }),
            }
          );
          const json = await response.json();
          if (json.success) {
            uploading.value = false;
            success.value = json.message;
            setTimeout(() => {
              router.push({
                name: "Profile",
                params: { id: props.userId },
              });
            }, 1500);
          } else {
            uploading.value = false;
            faild.value = json.message;
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    const handleclose = () => {};

    return {
      router,
      inputs,
      displayVideo,
      videoName,
      picked,
      success,
      faild,
      uploading,
      url,
      fileInput,
      toPost,
      handleFileName,
      findVideoWithHighestNumber,
      storeVideo,
      handleSubmit,
      handleclose,
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
.succes-message {
  font-size: 12px;
  color: #00cb5a;
}
.faild-message {
  font-size: 12px;
  color: red;
}
</style>
