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
    toPost: {
      type: Boolean,
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
    const router = useRouter();

    const saveMedia = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch("http://localhost:6500/api/users/media", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: props.userId,
            media: {
              title: inputs.value.media.value,
              url: props.url,
              posted: props.toPost,
            },
          }),
        });
        const json = await response.json();
        if (json.success) {
          props.closeCamera();
          router.push("/home");
        }
      } catch (error) {
        console.error(error);
      }
    };
    //   props.title(inputs.value.media.value);
    //   props.close();

    return {
      inputs,
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
