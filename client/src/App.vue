<template>
  <div class="flex flex-col justify-center items-center m-auto">
    <p class="text-gray-500 text-lg mb-5">Welcome to</p>
    <img class="w-48" src="../public/img/logo.png" alt="logo" />
    <router-link
      class="flex justify-center items-center mt-24 bg-blue-500 w-full h-9 rounded-md"
      to="/"
      ><h1 class="text-xl font-semibold text-gray-300">Login</h1></router-link
    >
    <router-link
      class="flex justify-center items-center mt-3 bg-blue-500 w-full h-9 rounded-md"
      to="/about"
      ><h1 class="text-xl font-semibold text-gray-300">SignUp</h1></router-link
    >
    <!-- <router-view /> -->
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
