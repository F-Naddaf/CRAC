<template>
  <div class="w-screen h-screen">
    <div class="video-section"></div>
    <SideNav class="absolute right-0 bottom-28" />
    <NavBar class="absolute bottom-0" />
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue"
import SideNav from "../components/SideNav.vue"

export default {
  name: "HomePage",
  components: {
    NavBar,
    SideNav
  }
}
</script>

<style scoped>
.video-section {
  margin-left: 2%;
  margin-top: 2%;
  background-color: white;
  width: 85%;
  height: 92%;
}
</style>