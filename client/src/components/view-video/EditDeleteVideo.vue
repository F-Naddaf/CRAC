<template>
  <div class="flex w-28 items-center justify-between">
    <button
      v-if="!posted"
      class="text-sm text-gray-100 -mb-1 w-12 h-6 bg-secondary-100 rounded"
      id="post-btn"
      style="text-shadow: 0.5px 0.5px #262626"
      @click="postNow"
    >
      Post
    </button>
    <button
      v-else
      class="text-sm text-gray-100 -mb-1 w-12 h-6 bg-secondary-100 rounded"
      id="edit-btn"
      style="text-shadow: 0.5px 0.5px #262626"
      @click="postNow"
    >
      Edit
    </button>
    <button
      class="text-sm text-gray-100 -mb-1 w-12 h-6 bg-primary-100 rounded"
      id="delete-btn"
      style="text-shadow: 0.5px 0.5px #262626"
      @click="deleteVideo"
    >
      Delete
    </button>
  </div>
</template>

<script>
import {
  ref as toRef,
  inject,
  reactive,
  onMounted,
  watch,
  computed,
} from "vue";
import { useRouter } from "vue-router";
import { ref, listAll, deleteObject } from "firebase/storage";
import { storage } from "../../firebase.js";

export default {
  name: "EditDeleteVideo",
  props: {
    posted: Boolean,
    videoId: String,
    paramsId: String,
  },
  setup(props, { emit }) {
    const router = useRouter();
    const posted = toRef(props);
    const showModel = toRef(false);
    const paramsId = toRef(props.paramsId);
    const showMessage = toRef(false);
    const message = toRef("");

    const postNow = () => {
      showModel.value = true;
      emit("showModel", showModel.value);
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

    const deleteVideo = async () => {
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
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch(
          `https://crac-server.onrender.com/api/videos/deleteVideo/${props.videoId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await response.json();
        if (json.success) {
          showMessage.value = true;
          message.value = json.message;
          emit("toggleShowMessage", showMessage.value);
          emit("toggleMessage", message.value);
          setTimeout(() => {
            router.push({
              name: "Profile",
              params: { userId: paramsId.value },
            });
          }, 2000);
        }
      } catch (error) {
        console.error(error);
      }
    };

    return {
      posted,
      showModel,
      showMessage,
      message,
      postNow,
      deleteVideo,
    };
  },
};
</script>

<style scoped>
#post-btn:hover {
  background-color: #034663;
  color: rgb(206, 206, 206);
}
#edit-btn:hover {
  background-color: #034663;
  color: rgb(206, 206, 206);
}
#delete-btn:hover {
  background-color: #820342;
  color: rgb(206, 206, 206);
}
</style>
