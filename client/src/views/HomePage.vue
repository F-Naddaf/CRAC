<template>
  <div class="w-full h-screen relative">
    <div class="flex w-full justify-between items-center" id="head">
      <div class="input-container">
        <input type="search" class="search-input" />
        <div class="search-container">
          <i class="fa-solid fa-magnifying-glass"></i>
          <p class="search">Search...</p>
        </div>
      </div>
      <div class="logo-container">
        <DanceAnimation />
      </div>
    </div>
    <div class="video-container">
      <div class="vedio-section">
        <video loop autoplay>
          <source
            class="source"
            src="https://firebasestorage.googleapis.com/v0/b/crac-video-upload.appspot.com/o/videos%2F99b3dc3a-fc32-4701-b8b1-48052620d7e2?alt=media&token=63fa9537-1792-4ef6-9e3d-267f538f76ba"
            type="video/mp4"
          />
        </video>
        <!-- <img class="image" src="../../public/img/people.jpg" alt="prople" /> -->
      </div>
      <div class="flex justify-center; z-30 ml-auto mr-auto mb-8">
        <SideNav @toggle-share-container="toggleShareContainer" />
      </div>
    </div>
    <div class="nav-container">
      <NavBar />
    </div>
    <div v-if="openShareMedia !== null" class="open-social-media">
      <SocialMedia
        :isClosed="isSocialMediaClosed"
        @close="isSocialMediaClosed = true"
      />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import NavBar from "../components/NavBar.vue";
import SideNav from "../components/SideNav.vue";
import SocialMedia from "../components/SocialMedia.vue";
import DanceAnimation from "../components/DanceAnimation.vue";

export default {
  name: "HomePage",
  components: {
    NavBar,
    SideNav,
    SocialMedia,
    DanceAnimation,
  },
  setup() {
    const openShareMedia = ref(null);
    const isSocialMediaClosed = ref(false);

    const toggleShareContainer = () => {
      if (openShareMedia.value === null) {
        openShareMedia.value = true;
      } else {
        openShareMedia.value = !openShareMedia.value;
        isSocialMediaClosed.value = false;
      }
    };
    return {
      openShareMedia,
      isSocialMediaClosed,
      toggleShareContainer,
    };
  },
};
</script>

<style scoped>
#head {
  height: 6vh;
}
.input-container {
  position: relative;
  display: flex;
  margin-left: 8px;
  width: 86%;
}
.search-input {
  background: none;
  border: 1px solid #9e9e9e;
  font-size: 14px;
  padding: 2px 5px;
  color: #9e9e9e;
  width: 30%;
  z-index: 10;
  transition: all 0.5s ease;
  float: right;
  border-radius: 5px;
}
.search-input:focus ~ .search-container {
  display: none;
}
.search-input:focus {
  width: 100%;
}
.search-input:focus {
  outline: none;
  border: 1px solid #ba2f74;
}
.search-container {
  position: absolute;
  display: flex;
  align-items: center;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
}
.fa-magnifying-glass {
  font-size: 16px;
  color: #9e9e9e;
  z-index: 5;
}
.search {
  font-size: 14px;
  text-transform: capitalize;
  color: #9e9e9e;
  padding-left: 5px;
  z-index: 5;
}
.logo-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  margin: 8px;
}
.video-container {
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 86vh;
}
.vedio-section {
  margin-left: 10px;
  max-width: 24rem;
  overflow: hidden;
  height: 100%;
}
.image {
  width: 100%;
  height: 100vh;
}
.nav-container {
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 10;
}
.open-social-media {
  width: 100%;
  position: absolute;
  bottom: 0;
  transform: translateY(-200px);
  transition: transform 0.3s ease-in-out;
  z-index: 50;
}
video {
  width: 100%;
  height: 100%;
}
.vedio-section video {
  object-fit: cover;
}
</style>
