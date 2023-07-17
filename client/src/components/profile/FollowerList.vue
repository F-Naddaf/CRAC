<template>
  <div class="list-container">
    <div class="list-card" id="listCard">
      <i class="fa-solid fa-circle-xmark" @click="closeFollowerList"></i>
      <section class="w-full flex justify-center mb-4">
        <h2 class="font-semibold text-primary-200">Follower List</h2>
      </section>
      <section class="w-full flex flex-col justify-center">
        <div v-if="isLoading" class="mt-20 flex justify-center">
          <img src="../../../public/img/spinner.svg" alt="loading" />
        </div>
        <div v-else-if="followersArray.length === 0">
          <p class="text-base text-primary-200">
            Sorry, you don't have Friend in your list.
          </p>
        </div>
        <FriendsCard
          v-else
          v-for="(friend, index) in followersArray"
          :key="friend._id"
          :id="friend._id"
          :userImage="friend.userImage"
          :username="friend.username"
          :firstname="friend.firstname"
          :lastname="friend.lastname"
          :followers="friend.followers"
          :isActivate="friend.isActivate"
          :i="index"
        />
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import FriendsCard from "@/components/friend/FriendsCard.vue";

export default {
  props: {
    followers: {
      type: Array,
    },
    close: {
      type: Function,
    },
    show: {
      type: Boolean,
    },
    id: {
      type: String,
    },
  },
  components: {
    FriendsCard,
  },

  name: "FollowerList",
  emits: ["close"],
  setup(props, { emit }) {
    const show = ref(false);
    const followersArray = ref([]);
    const isLoading = ref(true);

    onMounted(async () => {
      await getAllFollowers();
      document.addEventListener("click", handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    const getAllFollowers = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch(
          `https://crac-server.onrender.com/api/users/followersDetail/${props.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await response.json();
        followersArray.value = json.result;
        isLoading.value = false;
      } catch (error) {
        console.error(error);
      }
    };

    const handleClickOutside = (event) => {
      const listCard = document.getElementById("listCard");
      if (listCard && !listCard.contains(event.target)) {
        emit("close");
      }
    };

    const closeFollowerList = () => {
      emit("close");
    };

    return {
      show,
      followersArray,
      isLoading,
      getAllFollowers,
      closeFollowerList,
    };
  },
};
</script>

<style scoped>
.list-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 200;
}
.list-card {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  padding: 6px 0;
  width: 80%;
  height: 65%;
  overflow: scroll;
  background-color: rgba(0, 0, 0, 0.8);
  border: 1px solid white;
  border-radius: 8px;
  flex-direction: column;
}
.fa-circle-xmark {
  position: absolute;
  top: 10px;
  left: 6px;
  border-radius: 50%;
  border: 1px solid #e67cb1;
  background-color: #e67cb1;
  cursor: pointer;
}
.list-card::-webkit-scrollbar {
  display: none;
}
</style>
