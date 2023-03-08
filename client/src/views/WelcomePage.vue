<template>
  <div class="welcomeCard">
    <p class="text-gray-500 text-lg mb-9">Welcome to</p>
    <img class="w-48" src="../../public/img/logo.png" alt="logo" />
    <router-link
    class="primaryLink mt-24"
    to="/login"
    ><h1 class="text-lg font-semibold text-gray-300">Get Start</h1></router-link
    >
  </div>
</template>

<script>
  export default {
    name: "WelcomePage"
  }
</script>
