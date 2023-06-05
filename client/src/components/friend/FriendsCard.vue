<template>
  <router-link :to="`/friend/profile/${id}`" class="friend-card">
    <div
      class="absolute flex h-20 w-20 -left-4 items-center justify-start border-2 border-gray-200 rounded-full overflow-hidden"
    >
      <img :src="userImage" />
    </div>
    <div class="friend-card-container">
      <p class="text-xs font-thin text-secondary-200">Username:</p>
      <p class="text-sm text-secondary-200">#{{ username }}</p>
    </div>
    <div class="friend-card-container">
      <p class="text-xs font-thin text-secondary-200">Full Name:</p>
      <p class="text-sm text-secondary-200">{{ firstname }} {{ lastname }}</p>
    </div>
    <div class="absolute right-2 top-2 ml-16 z-30">
      <button class="flex items-center" @click="deleteFriend">
        <i class="fa-solid fa-ban"></i>
        <p class="text-xs font-base text-primary-200">Unfollow</p>
      </button>
    </div>
  </router-link>
</template>

<script>
import { onMounted, ref, inject, watch } from "vue";

export default {
  name: "FriendsCard",
  props: {
    id: String,
    user: String,
    userImage: String,
    username: String,
    firstname: String,
    lastname: String,
  },
  setup(props, { emit }) {
    const deleteFriend = () => {
      emit("deleteFriend");
    };

    onMounted(async () => {
      console.log("id", props.id);
    });

    return {
      deleteFriend,
    };
  },
};
</script>

<style scoped>
img {
  object-fit: cover;
}
button i {
  font-weight: bold;
  font-size: 10px;
  color: #d0e5ee;
  margin-right: 4px;
  color: #ba2f74;
}
</style>
