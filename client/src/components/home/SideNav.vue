<template>
  <aside class="flex flex-col mr-1 ml-1 justify-center h-fit w-10">
    <button
      class="iconCard bg-gray-700 rounded-full w-8 h-8 justify-center border-2 border-gray-200"
    >
      <i class="fa-solid fa-user text-gray-200 text-xl"></i>
    </button>
    <button @click="addToFavorite" class="iconCard pt-10">
      <i
        class="fa-solid fa-heart text-2xl"
        :class="`${
          isFavorite(store.state.userData?.favoriteVideos)
            ? 'text-red-500'
            : 'text-gray-200'
        }`"
      ></i>
      <p
        class="absolute -bottom-1 left-5 text-primary-100 text-xs font-semibold"
      >
        {{ updatedAmountOfLike }}
      </p>
    </button>
    <button class="iconCard pt-10">
      <i class="fa-solid fa-comment-dots text-2xl text-gray-200"></i>
    </button>
    <button class="iconCard pt-10">
      <i class="fa-solid fa-bookmark text-2xl text-gray-200"></i>
    </button>
    <button class="iconCard pt-10" @click="$emit('shareClicked')">
      <i class="fa-solid fa-share text-2xl text-gray-200"></i>
    </button>
  </aside>
</template>

<script>
import { ref, inject, onMounted } from "vue";

export default {
  props: {
    videoId: {
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
    const updatedAmountOfLike = ref(props.amountOfLike);

    onMounted(() => {
      store.methods.load();
    });

    function isFavorite(favoriteArray) {
      const getVideoId = favoriteArray?.map((video) => {
        return {
          id: video.videoId,
        };
      });
      const isExist = getVideoId?.some((item) => item.id === props.videoId);
      return isExist;
    }

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
      updatedAmountOfLike,
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
</style>
