<template>
  <div class="relative w-full h-full flex flex-col items-center justify-center">
    <i class="fa-solid fa-circle-xmark" @click="goBack"></i>
    <div class="card">
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
          <button @click="handleSubmit" class="continueButton">Continue</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "firebase/storage";
import { storage } from "../../firebase.js";
import { ref as varRef, onMounted, nextTick, watch } from "vue";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  getStorage,
  getMetadata,
} from "firebase/storage";

export default {
  name: "UploadVideoCard",

  props: {
    userId: String,
    userImage: String,
    username: String,
  },

  setup(props) {
    const displayVideo = varRef("");
    const videoName = varRef("");
    const picked = varRef("later");
    const url = varRef("");
    const toPost = varRef(false);
    const fileInput = varRef(null);

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
      console.log("videoFile", videoFile);
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
      //   if (items.length === 0) {
      const newVideosRef = ref(storageRef, "videos/" + newFileName);
      console.log("newVideosRef", newVideosRef);
      const snapShot = await uploadBytes(newVideosRef, videoFile, metadata);
      url.value = await getDownloadURL(snapShot.ref);
      //   }
    };

    const handleSubmit = async () => {
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
            console.log("json", json);
            // router.push({
            //   name: "Profile",
            //   params: { id: userId.value },
            // });
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    return {
      displayVideo,
      videoName,
      picked,
      url,
      fileInput,
      toPost,
      //   blob,
      handleFileName,
      findVideoWithHighestNumber,
      storeVideo,
      handleSubmit,
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
