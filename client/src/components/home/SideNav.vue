<template>
  <aside class="flex flex-col mr-1 ml-1 justify-center h-fit w-10">
    <div>
      <button class="relative">
        <div
          class="flex items-center justify-center bg-gray-700 rounded-full w-12 h-12 justify-center border-2 border-gray-200 overflow-hidden"
        >
          <img
            v-if="currentUserimage"
            :src="currentUserimage"
            class="h-12 object-cover"
          />
          <i v-else class="fa-solid fa-user text-gray-200 text-xl"></i>
        </div>
        <button v-if="showAdd" class="addBtn" @click="addToFriends">
          <i class="fa-solid fa-plus text-gray-300 text-xs"></i>
        </button>
      </button>
    </div>

    <div class="mt-10">
      <button @click="addToFavorite" class="iconCard">
        <i
          class="fa-solid fa-heart text-2xl"
          :class="`${
            isFavorite(store.state.userData?.favoriteVideos)
              ? 'text-primary-100'
              : 'text-gray-200'
          }`"
        ></i>
        <p
          class="absolute -bottom-1 left-5 text-primary-100 text-xs font-semibold"
        >
          {{ updatedAmountOfLike }}
        </p>
      </button>
    </div>

    <div class="mt-10">
      <button class="iconCard">
        <i class="fa-solid fa-comment-dots text-2xl text-gray-200"></i>
      </button>
    </div>

    <div class="mt-10">
      <button class="iconCard">
        <i class="fa-solid fa-bookmark text-2xl text-gray-200"></i>
      </button>
    </div>

    <div class="mt-10">
      <button class="iconCard" @click="$emit('shareClicked')">
        <i class="fa-solid fa-share text-2xl text-gray-200"></i>
      </button>
    </div>
  </aside>
</template>

<script>
import { ref, inject, onMounted } from "vue";

export default {
  props: {
    videoId: {
      type: String,
    },
    userId: {
      type: String,
    },
    userImage: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    amountOfLike: {
      type: Number,
      required: true,
    },
  },
  name: "SideNav",
  setup(props) {
    const store = inject("store");
    const currentUserId = ref("");
    const updatedAmountOfLike = ref(props.amountOfLike);
    const currentUserimage = ref(props.userImage);
    const friendsArry = ref([]);
    const showAdd = ref(false);

    onMounted(async () => {
      await store.methods.load();
      friendsArry.value = store.state.userData?.friends;
      currentUserId.value = store.state.userData?._id;
      showAddToFriends();
    });

    const showAddToFriends = () => {
      const findFriend = friendsArry.value.some(
        (friend) => friend.userId === props.userId
      );
      if (currentUserId.value === props.userId || findFriend) {
        showAdd.value = false;
      } else {
        showAdd.value = true;
      }
    };

    function isFavorite(favoriteArray) {
      const getVideoId = favoriteArray?.map((video) => {
        return {
          id: video.videoId,
        };
      });
      const isExist = getVideoId?.some((item) => item.id === props.videoId);
      return isExist;
    }

    const addToFriends = async () => {
      if (currentUserId.value) {
        try {
          const response = await fetch(
            `http://localhost:6500/api/users/${currentUserId.value}/addFriend`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                friendId: props.userId,
                userId: currentUserId.value,
              }),
            }
          );
          const json = await response.json();
          if (json.message === "Friend added successfully") {
            showAdd.value = false;
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    const addToFavorite = async () => {
      await store.methods.load();
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch(
          `http://localhost:6500/api/users/${props.videoId}/favorite`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId: store.state.userData?._id,
              videoId: props.videoId,
              url: props.videoUrl,
            }),
          }
        );
        const json = await response.json();
        store.methods.updateUser(json.result);
        if (json.message === "Video is removed from favorites successfully") {
          updatedAmountOfLike.value -= 1;
        } else if (
          json.message === "Video is added to favorites successfully"
        ) {
          isFavorite.value = true;
          updatedAmountOfLike.value += 1;
        } else {
          updatedAmountOfLike.value = props.amountOfLike;
        }
      } catch (error) {
        console.error(error);
      }
    };

    return {
      store,
      isFavorite,
      currentUserId,
      updatedAmountOfLike,
      currentUserimage,
      friendsArry,
      showAdd,
      addToFriends,
      addToFavorite,
    };
  },
};
</script>

<style scoped>
.fa-heart,
.fa-comment-dots,
.fa-bookmark,
.fa-share {
  filter: drop-shadow(0px 0px 3px rgb(0 0 0 / 0.4));
}
.addBtn {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 16px;
  width: 16px;
  background-color: #ba2f74;
  border-radius: 50%;
  left: 50%;
  bottom: -12px;
  transform: translateX(-50%);
}
</style>
