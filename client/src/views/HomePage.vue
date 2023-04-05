<template>
  <div class="w-full h-screen relative">
    <div class="flex w-full h-8.5 justify-between items-center">
      <div class="input-container">
        <input type="search" class="search-input" />
        <div class="search-container">
          <i class="fa-solid fa-magnifying-glass"></i>
          <p class="search">Search...</p>
        </div>
      </div>
      <div class="logo-container">
        <img
          class="h-auto w-5 pb-0.5 pl-0.5 opacity-70"
          src="../../public/img/logo-icon-white.png"
          alt="logo"
        />
      </div>
    </div>
    <div class="video-container">
      <div class="vedio-section">
        <img class="image" src="../../public/img/people.jpg" alt="prople" />
      </div>
      <div class="flex justify-center; z-30 ml-auto mr-auto mb-8">
        <SideNav />
      </div>
    </div>
    <div class="nav-container">
      <NavBar />
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import SideNav from "../components/SideNav.vue";

export default {
  name: "HomePage",
  components: {
    NavBar,
    SideNav,
  },
};
</script>

<style scoped>
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
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  background-color: #ba2f74;
  border-radius: 50%;
  margin: 8px;
}
.video-container {
  display: flex;
  align-items: flex-end;
  position: absolute;
  bottom: 56px;
  width: 100%;
  height: 88%;
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
</style>
