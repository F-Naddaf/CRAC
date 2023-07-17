<template>
  <div class="active-user-container">
    <div class="active-card" :class="{ 'slide-down': showCard }">
      <button class="close-active-users" @click="$emit('close-clicked')">
        <i class="fa-solid fa-circle-xmark"></i>
        <p class="text-primary-100 text-sm font-bold">Close</p>
      </button>
      <div class="user-card" v-for="(user, index) in users" :key="user._id">
        <router-link
          :to="`/friend/profile/${user._id}`"
          class="flex items-center w-full"
        >
          <div
            class="absolute flex h-20 w-20 -left-4 items-center justify-start border-2 border-gray-200 rounded-full overflow-hidden"
          >
            <img v-if="user.userImage" :src="user.userImage" />
            <i v-else class="fa-solid fa-user text-gray-200 text-3xl ml-6"></i>
          </div>
          <div class="user-wrapper">
            <div class="friend-card-container">
              <p class="text-xs font-thin text-primary-200">Username:</p>
              <p class="text-xs text-secondary-200">#{{ user.username }}</p>
            </div>
            <div class="friend-card-container items-center">
              <p class="text-xs font-thin text-primary-200">Follower:</p>
              <p class="text-xs text-secondary-200">
                {{ user.followers.length }}
              </p>
            </div>
            <div class="friend-card-container">
              <p class="text-xs font-thin text-primary-200">User Status:</p>
              <div
                v-if="user.isActivate"
                class="flex items-center justify-center"
              >
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
        <div
          class="absolute right-0 top-0 z-40 h-full w-2"
          :class="getCardStyle(index)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";

export default {
  name: "ActiveUsersCard",
  props: {
    showActiveUsersCard: Boolean,
  },
  setup(props, { emit }) {
    const users = ref([]);
    const showCard = ref(props.showActiveUsersCard);

    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        emit("close-clicked");
      }
    };

    onMounted(() => {
      document.addEventListener("keydown", handleKeydown);
      activeUsers();
    });

    const activeUsers = async () => {
      try {
        const response = await fetch(`https://crac-server.onrender.com/api/users/active`);
        const result = await response.json();
        users.value = result;
      } catch (error) {
        console.log(error);
      }
    };

    const getCardStyle = computed(() => {
      return (index) => {
        if (index % 2 === 0) {
          return "bg-primary-100 opacity-60";
        } else {
          return "bg-secondary-100 opacity-80";
        }
      };
    });

    return {
      users,
      showCard,
      activeUsers,
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
.active-user-container {
  position: absolute;
  width: 80%;
  max-height: 80%;
  animation: active-user-container-load 500ms ease-in;
  top: 8%;
}
.active-card {
  width: 100%;
  height: auto;
  height: 100%;
  padding: 20px 0 12px 0;
  overflow: auto;
  border: 1px solid white;
  border-radius: 10px;
}
.active-card::-webkit-scrollbar {
  display: none;
}

@keyframes active-user-container-load {
  0% {
    transform: translateY(-50%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
.close-active-users {
  display: flex;
  align-items: center;
  position: absolute;
  top: -28px;
  left: 0;
  cursor: pointer;
  z-index: 200;
}
.fa-circle-xmark {
  font-size: 14px;
}
</style>
