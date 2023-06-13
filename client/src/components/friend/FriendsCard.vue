<template>
  <div class="friend-card">
    <router-link :to="`/friend/profile/${id}`" class="flex items-center w-full">
      <div
        class="absolute flex h-20 w-20 -left-4 items-center justify-start border-2 border-gray-200 rounded-full overflow-hidden"
      >
        <img v-if="userImage" :src="userImage" />
        <i v-else class="fa-solid fa-user text-gray-200 text-3xl ml-6"></i>
      </div>
      <div class="user-wrapper">
        <div class="friend-card-container">
          <p class="text-xs font-thin text-primary-200">Username:</p>
          <p class="text-xs text-secondary-200">#{{ username }}</p>
        </div>
        <div class="friend-card-container items-center">
          <p class="text-xs font-thin text-primary-200">Follower:</p>
          <p class="text-xs text-secondary-200">{{ numberOfFollower }}</p>
        </div>
        <div class="friend-card-container">
          <p class="text-xs font-thin text-primary-200">User Status:</p>
          <div v-if="isActivate" class="flex items-center justify-center">
            <span
              class="w-2 h-2 rounded-full mr-1"
              style="background: #00cb5a"
            ></span>
            <p class="text-xs text-secondary-200" style="color: #00cb5a">
              Online
            </p>
          </div>
          <div v-else class="flex items-center justify-center">
            <span class="w-2 h-2 rounded-full mr-1 bg-red-600"></span>
            <p class="text-xs text-red-600">Offline</p>
          </div>
        </div>
      </div>
    </router-link>
    <div v-if="showUnfollowButton" class="absolute right-2 top-2.5 ml-16 z-40">
      <button class="flex items-center" @click="deleteFriend">
        <i class="fa-solid fa-ban"></i>
        <p class="text-xs font-base text-primary-200">Unfollow</p>
      </button>
    </div>
    <div
      v-else
      class="absolute right-0 top-0 z-40 h-full w-4"
      :class="getCardStyle"
    ></div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "FriendsCard",
  props: {
    id: String,
    user: String,
    userImage: String,
    username: String,
    isActivate: Boolean,
    i: Number,
    followers: {
      type: Array,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const numberOfFollower = ref(props.followers.length);
    const route = useRoute();
    const deleteFriend = () => {
      emit("deleteFriend");
    };

    const showUnfollowButton = computed(() => {
      return route.path === `/friends`;
    });

    const getCardStyle = computed(() => {
      if (props.i % 2 === 0) {
        return "bg-primary-100 opacity-60";
      } else {
        return "bg-secondary-100 opacity-80";
      }
    });

    return {
      numberOfFollower,
      deleteFriend,
      showUnfollowButton,
      getCardStyle,
    };
  },
};
</script>

<style scoped>
img {
  object-fit: cover;
}
.user-wrapper {
  margin-left: 60px;
  width: 65%;
  display: flex;
  height: 100%;
  justify-content: space-between;
}
button i {
  font-weight: bold;
  font-size: 10px;
  color: #d0e5ee;
  margin-right: 4px;
  color: #ba2f74;
}
</style>
