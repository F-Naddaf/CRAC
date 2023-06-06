<template>
  <nav class="navigation">
    <ul class="flex justify-around items-center w-full h-full">
      <li>
        <button class="iconCard" @click="goHome">
          <i class="fa-solid fa-house"></i>
          <p class="iconTitle">Home</p>
        </button>
      </li>
      <li>
        <button class="iconCard" @click="goFriends">
          <i class="fa-solid fa-user-group"></i>
          <p class="iconTitle">Friends</p>
        </button>
      </li>
      <li>
        <button class="cameraBtn" @click="openCamera">
          <i class="fa-solid fa-plus"></i>
        </button>
        <span class="cameraShadowPrimary"></span>
        <span class="cameraShadowSecondary"></span>
      </li>
      <li>
        <button class="iconCard">
          <i class="fa-solid fa-message"></i>
          <p class="iconTitle">Inbox</p>
        </button>
      </li>
      <li>
        <button id="user" class="iconCard" @click="profile">
          <i class="fa-solid fa-user"></i>
          <p class="iconTitle">Profile</p>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
import { ref, inject, onMounted } from "vue";
import router from "../router";

export default {
  name: "NavBar",
  setup() {
    const store = inject("store");
    const id = ref("");
    const videoId = ref(store.state.userData?.videoId);

    const goHome = () => {
      router.push(`/${videoId}/home`);
    };
    const openCamera = () => {
      router.push("/camera");
    };
    const profile = () => {
      router.push({ name: "Profile", params: { id: id.value } });
    };
    const goFriends = () => {
      router.push("/friends");
    };

    onMounted(async () => {
      await store.methods.load();
      id.value = store.state.userData?._id;
    });

    return {
      store,
      id,
      videoId,
      goHome,
      openCamera,
      profile,
      goFriends,
    };
  },
};
</script>

<style scoped>
.navigation {
  border-top-width: 2px;
  max-width: 28rem;
  height: 7vh;
  margin-bottom: 0.5rem;
}
li {
  position: relative;
  width: 2rem;
  height: 1.5rem;
}
.cameraBtn {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  width: 2rem;
  height: 1.5rem;
  border-radius: 6px;
  z-index: 10;
}
.fa-solid {
  color: rgb(209 213 219);
  z-index: 40;
}

.fa-plus {
  color: black;
  z-index: 15;
}
</style>
