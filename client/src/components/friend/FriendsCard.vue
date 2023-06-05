<template>
  <div class="friend-card">
    <router-link :to="`/friend/profile/${id}`" class="flex items-center">
      <div
        class="absolute flex h-20 w-20 -left-4 items-center justify-start border-2 border-gray-200 rounded-full overflow-hidden"
      >
        <img v-if="userImage" :src="userImage" />
        <i v-else class="fa-solid fa-user text-gray-200 text-3xl ml-6"></i>
      </div>
      <div class="friend-card-container">
        <p class="text-xs font-thin text-secondary-200">Username:</p>
        <p class="text-sm text-secondary-200">#{{ username }}</p>
      </div>
      <div class="friend-card-container">
        <p class="text-xs font-thin text-secondary-200">Full Name:</p>
        <p class="text-sm text-secondary-200">{{ firstname }} {{ lastname }}</p>
      </div>
    </router-link>
    <div class="absolute right-2 top-2 ml-16 z-40">
      <button class="flex items-center" @click="deleteFriend">
        <i class="fa-solid fa-ban"></i>
        <p class="text-xs font-base text-primary-200">Unfollow</p>
      </button>
    </div>
  </div>
</template>

<script>
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
