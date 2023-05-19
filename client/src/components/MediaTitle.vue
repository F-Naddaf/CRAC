<template>
  <div class="w-full h-screen relative z-100">
    <div
      class="flex flex-col justify-center items-center w-full h-full rounded-md"
    >
      <form @submit.prevent="saveMediaTitle" class="card">
        <h1 class="mb-5 text-2xl font-bold text-secondary-200">
          Save for later
        </h1>
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
          <button type="submit" class="secondaryButton">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import FormInput from "./FormInput.vue";

export default {
  name: "MediaTitle",
  props: ["close"],

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

    return {
      inputs,
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
