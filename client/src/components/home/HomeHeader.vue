<template>
  <div
    class="flex w-full absolute top-0 justify-between items-center"
    id="head"
  >
    <div class="input-container">
      <input
        type="search"
        class="search-input"
        v-model="searchTitle"
        @keyup.enter="searchVideos"
        @blur="clearSearchText"
      />
      <div class="search-container">
        <i class="fa-solid fa-magnifying-glass"></i>
        <p class="search">Search...</p>
      </div>
    </div>
    <div class="logo-container">
      <DanceAnimation />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import DanceAnimation from "@/components/home/DanceAnimation.vue";

export default {
  name: "HomeHeader",
  components: {
    DanceAnimation,
  },

  setup(props, { emit }) {
    const searchTitle = ref("");
    const router = useRouter();

    const searchVideos = async (event) => {
      const title = event.target.value;
      console.log("title", title);
      try {
        const response = await fetch(
          `http://localhost:6500/api/videos/search/${searchTitle.value}`
        );
        const result = await response.json();
        const videoId = result.videos[0]._id;
        router.push(`/search-result/${videoId}`);
        emit("video-id", videoId);
      } catch (error) {
        console.log(error);
      }
    };
    const clearSearchText = () => {
      searchTitle.value = "";
    };

    return {
      searchTitle,
      searchVideos,
      clearSearchText,
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
</style>
