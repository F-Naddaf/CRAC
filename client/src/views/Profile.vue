<template>
  <div class="w-full h-full flex flex-col">
    <section class="w-full h-1/3">
      <UserInfo>
        <template #category>
          {{ activeCategory }}
        </template>
      </UserInfo>
    </section>
    <section class="w-full h-2/3">
      <Tabs :activeCategory="activeCategory" />
    </section>
    <div class="bg-black">
      <NavBar />
    </div>
  </div>
</template>

<script>
import Tabs from "../components/profile/Tabs.vue";
import UserInfo from "../components/profile/UserInfo.vue";
import NavBar from "../components/NavBar.vue";
export default {
  name: "Profile",
  components: {
    UserInfo,
    Tabs,
    NavBar,
  },
  data() {
    return {
      activeCategory: "Unposted",
    };
  },
};
</script>

<style>
/* h1 {
  color: #ba2f74;
  font-size: larger;
  font-weight: bold;
  padding: 8px 0;
} */
</style>
