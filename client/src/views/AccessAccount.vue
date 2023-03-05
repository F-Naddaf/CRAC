<template>
  <div class="flex flex-col justify-center items-center w-1/2 sm:w-3/4 md:w-1/2 lg:w-1/2 m-auto">
    <router-link
      class="primaryLink mt-24"
      to="/"
      ><h1 class="text-lg font-semibold text-gray-300">Login</h1></router-link
    >
    <router-link
      class="secondaryLink mt-3"
      to="/"
      ><h1 class="text-lg font-semibold text-gray-300">SignUp</h1></router-link
    >
  </div>
</template>

<script>
export default {
  name: "AccessAccount"
}
</script>
