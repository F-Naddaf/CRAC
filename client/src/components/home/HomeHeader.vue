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
    <button @click="$emit('active-users-clicked')" class="logo-container">
      <img
        class="w-12 mb-1"
        src="../../../public/img/online-logo.png"
        alt="online"
      />
      <div class="logo-shadow"></div>
    </button>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "HomeHeader",

  setup() {
    const searchTitle = ref("");
    const router = useRouter();

    const searchVideos = () => {
      if (searchTitle.value.trim() !== "") {
        const title = encodeURIComponent(searchTitle.value.trim());
        router.push(`/search-result/${title}`);
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
  margin-right: 8px;
  margin-bottom: 1px;
  z-index: 10;
  cursor: pointer;
}
.logo-shadow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transform: scale(1.2);
  animation: animate 1s linear infinite;
  background: radial-gradient(circle, #ba2f74 0%, rgba(186, 47, 116, 0) 70%);
  z-index: -1;
}

@keyframes animate {
  0% {
    color: #fff;
    filter: blur(8px) hue-rotate(0deg);
    text-shadow: 0 0 10px #ba2f74,
      0 0 20px #ba2f74 0 0 40px #ba2f74 0 0 80px #ba2f74 0 0 120px #ba2f74 0 0
        200px #ba2f74 0 0 300px #ba2f74 0 0 400px #ba2f74;
  }
  30%,
  70% {
    color: #fff;
    filter: blur(8px) hue-rotate(360deg);
    text-shadow: 0 0 10px #ba2f74,
      0 0 20px #ba2f74 0 0 40px #ba2f74 0 0 80px #ba2f74 0 0 120px #ba2f74 0 0
        200px #ba2f74 0 0 300px #ba2f74 0 0 400px #ba2f74;
  }
  100% {
    color: transparent;
    box-shadow: none;
    filter: blur(8px) hue-rotate(0deg);
  }
}
</style>
