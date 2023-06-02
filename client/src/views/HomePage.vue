<template>
  <div class="w-full h-screen relative">
    <div class="flex w-full relative justify-between items-center" id="head">
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
    <VideoSection @shareClicked="toggleSocialMedia" />

    <div class="nav-container">
      <NavBar />
    </div>
    <SocialMedia :show="showSocialMedia" @closeClicked="closeSocialMedia" />
  </div>
</template>

<script>
import { ref } from "vue";
import DanceAnimation from "@/components/home/DanceAnimation.vue";
import VideoSection from "@/components/home/VideoSection.vue";
import NavBar from "@/components/NavBar.vue";
import SocialMedia from "@/components/home/SocialMedia.vue";
export default {
  name: "HomePage",
  components: {
    DanceAnimation,
    VideoSection,
    NavBar,
    SocialMedia,
  },

  setup() {
    const showSocialMedia = ref(false);

    const toggleSocialMedia = () => {
      this.showSocialMedia = !this.showSocialMedia;
    };

    const closeSocialMedia = () => {
      this.showSocialMedia = false;
    };

    return {
      showSocialMedia,
      toggleSocialMedia,
      closeSocialMedia,
    };
  },
  methods: {
    toggleSocialMedia() {
      this.showSocialMedia = !this.showSocialMedia;
    },
    closeSocialMedia() {
      this.showSocialMedia = false;
    },
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
</style>
