<template>
  <side class="flex flex-col mr-1 justify-center h-fit w-10">
    <button class="iconCard bg-gray-700 rounded-full w-8 h-8 justify-center border-2 border-gray-200">
      <i class="fa-solid fa-user text-gray-200 text-xl"></i>
    </button>
    <button class="iconCard pt-12">
      <i class="fa-solid fa-heart text-2xl"></i>
    </button>
    <button class="iconCard pt-12">
      <i class="fa-solid fa-comment-dots text-2xl"></i>
    </button>
    <button class="iconCard pt-12">
      <i class="fa-solid fa-bookmark text-2xl"></i>
    </button>
    <button class="iconCard pt-12">
      <i class="fa-solid fa-share text-2xl"></i>
    </button>
  </side>
</template>

<script>
export default {
  name: "SideNav"
}
</script>

<style scoped>
.fa-heart,
.fa-comment-dots,
.fa-bookmark,
.fa-share {
  color: rgb(209 213 219);
}
</style>