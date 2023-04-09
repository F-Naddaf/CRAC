<template>
  <div class="welcomeCard">
    <p text-data="Welcome" class="greeting">Welcome</p>
    <div class="relative w-full">
      <img class="w-full" src="../../public/img/logo.png" alt="logo" />
      <img class="animation-logo" src="../../public/img/logo.png" alt="logo" />
    </div>
    <router-link class="primaryLink mt-24" to="/login"
      ><h1 class="text-lg font-semibold text-gray-300">
        Get Start
      </h1></router-link
    >
  </div>
</template>

<script>
export default {
  name: "WelcomePage",
};
</script>

<style scoped>
.greeting {
  position: relative;
  font-size: 18px;
  margin-bottom: 36px;
  color: rgba(0, 0, 0, 0.1);
  justify-self: center;
}
.greeting::before {
  content: attr(text-data);
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  color: #ba2f74;
  border-right: 2px solid #ba2f74;
  overflow: hidden;
  animation: animate 3s linear;
}
@keyframes animate {
  0%,
  10% {
    width: 0;
  }
  70% {
    width: 100%;
  }
  99% {
    border-right: 2px solid #ba2f74;
  }
  100% {
    width: 100%;
    border-right: none;
  }
}

.greeting::before {
  animation-fill-mode: forwards;
}
.animation-logo {
  content: "";
  animation-name: logo-animation;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

@keyframes logo-animation {
  0% {
    transform: scale(1);
    filter: blur(0);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    filter: blur(5px);
    opacity: 0;
  }
}
</style>
