<template>
  <div class="flex flex-col h-full w-full">
    <section
      class="flex w-full h-16 justify-start text-xl font-base items-center mx-auto"
      id="head"
    >
      <div id="title-container">
        <h1
          class="text-gray-300 ml-4"
          style="text-shadow: rgb(38, 38, 38) 1px 1px"
        >
          Friends
        </h1>
      </div>
    </section>
    <section
      class="relative flex flex-col w-full h-full pt-4 items-center mx-auto overflow-scroll-auto"
      id="friend-section"
    >
      <div v-if="isLoading" class="mt-20">
        <img src="../../public/img/spinner.svg" alt="loading" />
      </div>
      <div v-else-if="friendsArray.length === 0">
        <p class="text-base text-primary-200">
          Sorry, you don't have Friend in your list.
        </p>
      </div>
      <FriendsCard
        v-else
        v-for="friend in friendsArray"
        :key="friend._id"
        :id="friend._id"
        :userImage="friend.userImage"
        :username="friend.username"
        :firstname="friend.firstname"
        :lastname="friend.lastname"
        :followers="friend.followers"
        :isActivate="friend.isActivate"
        @deleteFriend="deleteFriend(friend._id)"
      />
    </section>
    <NavBar />
  </div>
</template>

<script>
import { onMounted, ref, inject, watch } from "vue";
import FriendsCard from "@/components/friend/FriendsCard.vue";
import NavBar from "@/components/NavBar.vue";

export default {
  name: "Friends",
  components: {
    FriendsCard,
    NavBar,
  },
  setup() {
    const store = inject("store");
    const userId = ref("");
    const friendsArray = ref([]);
    const isLoading = ref(true);

    onMounted(async () => {
      await store.methods.load();
    });

    watch(
      () => store.state.userData,
      (userData) => {
        userId.value = userData?._id;
        getAllFriends();
      }
    );

    const getAllFriends = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch(
          `https://crac-server.onrender.com/api/users/friendDetails/${userId.value}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await response.json();
        friendsArray.value = json.result;
        isLoading.value = false;
      } catch (error) {
        console.error(error);
      }
    };

    const deleteFriend = async (friendId) => {
      const token = localStorage.getItem("accessToken");

      try {
        const response = await fetch(
          `https://crac-server.onrender.com/api/users/${userId.value}/friends/${friendId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          friendsArray.value = friendsArray.value.filter(
            (friend) => friend._id !== friendId
          );
        } else {
          console.error("Friend deletion failed:", response.statusText);
        }
      } catch (error) {
        console.error("Friend deletion failed:", error);
      }
    };

    return {
      store,
      userId,
      isLoading,
      getAllFriends,
      friendsArray,
      deleteFriend,
    };
  },
};
</script>

<style scoped>
#head {
  height: 6vh;
}
#friend-section {
  height: 86vh;
}
#title-container {
  display: flex;
  align-items: center;
  width: 110px;
  height: 35px;
  background: rgba(186, 47, 116, 0.7);
  position: relative;
  margin-top: 10px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
