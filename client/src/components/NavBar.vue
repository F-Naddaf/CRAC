<template>
  <nav class="flex justify-evenly h-2/12 w-screen mb-2">
    <button class="iconCard">
      <i class="fa-solid fa-house"></i>
      <p class="iconTitle">Home</p>
    </button>
    <button class="iconCard">
      <i class="fa-solid fa-user-group"></i>
      <p class="iconTitle">Friends</p>
    </button>
    <button class="cameraButton" @click="openCamera">
      <span class="cameraButtonColor">
        <i class="fa-solid fa-plus"></i>
      </span>
      <span class="cameraShadowPrimary"></span>
      <span class="cameraShadowSecondary"></span>
    </button>
    <button class="iconCard">
      <i class="fa-solid fa-message"></i>
      <p class="iconTitle">Inbox</p>
    </button>
    <button class="iconCard">
      <i class="fa-solid fa-user"></i>
      <p class="iconTitle">Profile</p>
    </button>
  </nav>
</template>

<script>
import router from "../router";

export default {
  name: "NavBar",
  methods: {
    openCamera() {
      router.push("/camera");
    },
  },
};
</script>

<style scoped>
.fa-solid {
  color: rgb(209 213 219);
  z-index: 40;
}

.fa-plus {
  color: black;
}
</style>
