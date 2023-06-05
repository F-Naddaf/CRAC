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
      <FriendsCard
        v-for="friend in friendsArray"
        :key="friend._id"
        :id="friend._id"
        :userImage="friend.userImage"
        :username="friend.username"
        :firstname="friend.firstname"
        :lastname="friend.lastname"
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
          `http://localhost:6500/api/users/friendDetails/${userId.value}`,
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
      } catch (error) {
        console.error(error);
      }
    };

    const deleteFriend = async (friendId) => {
      const token = localStorage.getItem("accessToken");

      try {
        const response = await fetch(
          `http://localhost:6500/api/users/${userId.value}/friends/${friendId}`,
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