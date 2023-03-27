<template>
  <div>
    <Camera :resolution="{ width: 375, height: 812 }" ref="camera" autoplay />
    <button class="btn" @click="snapshot">Record a video</button>
  </div>
</template>

<script>
import { ref } from "vue";
import Camera from "simple-vue-camera";

export default {
  name: "RecordVideo",
  setup() {
    const camera = ref(null);

    const snapshot = async () => {
      const blob = await camera.value?.snapshot();
      const url = URL.createObjectURL(blob);
      console.log("url", url);
    };
    return {
      camera,
      snapshot,
    };
  },
};
</script>

<style scoped>
.btn {
  color: white;
  background-color: red;
}
</style>
