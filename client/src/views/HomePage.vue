<template>
  <div class="w-screen h-screen">
    <div class="vedio-section">
      <img src="../../public/img/people.jpg" alt="prople" />
    </div>
    <div class="absolute right-0 bottom-28 z-30">
      <SideNav />
    </div>
    <div class="absolute bottom-0 z-30">
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
.vedio-section {
  display: flex;
  margin-left: 2%;
  position: absolute;
  background-color: rgb(214, 214, 214);
  bottom: 54px;
  width: 85%;
  height: 88%;
}
</style>
