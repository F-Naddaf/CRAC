<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <router-view />
  </div>
</template>

<script>
import store from "@/module/user.js";
import { provide } from "vue";

export default {
  name: "App",
  setup() {
    provide("store", store);
  },
};
</script>
