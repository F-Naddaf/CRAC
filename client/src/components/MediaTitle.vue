<template>
  <div class="w-full h-screen relative z-100">
    <div
      class="flex flex-col justify-center items-center w-full h-full rounded-md"
    >
      <form @submit.prevent="saveMediaTitle" class="card">
        <h1 class="mb-5 text-2xl font-bold text-secondary-200">Video Title</h1>
        <FormInput
          v-for="(input, index) in inputs"
          :key="index"
          :label="input.label"
          :type="input.type"
          v-model="input.value"
          @update:value="input.value = $event"
        />
        <p
          v-if="success"
          class="text-base font-semibold"
          style="color: #00cb5a"
        >
          {{ message }}
        </p>
        <p v-else class="text-primary-200 font-semibold text-base">
          {{ message }}
        </p>
        <div class="flex items-center justify-between w-full mt-5">
          <button
            class="secondaryButtonBorder"
            type="button"
            @click="$emit('close')"
          >
            Close
          </button>
          <button type="submit" class="secondaryButton" @click="saveMedia">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import FormInput from "./FormInput.vue";

export default {
  name: "MediaTitle",
  props: {
    close: {
      type: Function,
    },
    url: {
      type: String,
    },
    userId: {
      type: String,
    },
    userImage: {
      type: String,
    },
    username: {
      type: String,
    },
    mediaId: {
      type: String,
    },
    getSongImage: {
      type: String,
    },
    getSelectedSongUrl: {
      type: String,
    },
    closeCamera: {
      type: Function,
    },
  },

  components: {
    FormInput,
  },

  setup(props) {
    const inputs = ref({
      media: {
        label: "Title",
        value: "",
        type: "text",
      },
    });
    const message = ref("");
    const success = ref(null);
    const router = useRouter();

    const saveMedia = async () => {
      const posted = true;
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
              songImage: props.getSongImage,
              audio: props.getSelectedSongUrl,
              media: {
                title: inputs.value.media.value,
                url: props.url,
                posted: posted,
              },
            }),
          }
        );
        const json = await response.json();
        success.value = false;
        message.value = json.message;
        if (json.success) {
          success.value = true;
          message.value = json.message;
          if (props.closeCamera) {
            props.closeCamera();
          }
          setTimeout(() => {
            router.push(`/profile/${props.userId}`);
          }, 2000);
        }
      } catch (error) {
        console.error(error);
      }
    };

    return {
      inputs,
      success,
      message,
      saveMedia,
    };
  },
};
</script>

<style scoped>
.model-mask {
  position: fixed;
  inset: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
