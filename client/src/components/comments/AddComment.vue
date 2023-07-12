<template>
  <form class="flex items-center w-full" @submit.prevent="handleComment">
    <div
      class="flex items-center justify-center bg-gray-700 mr-2 rounded-full w-10 h-10 justify-center border-2 border-gray-200 overflow-hidden"
    >
      <img v-if="userImage" :src="userImage" class="h-12 object-cover" />
      <i v-else class="fa-solid fa-user text-gray-200 text-xl"></i>
    </div>
    <input
      class="comment-input"
      type="text"
      placeholder="Add comment..."
      v-model="comment"
      @input="handleCommentUpdate"
    />
  </form>
</template>

<script>
import { ref, onMounted, inject } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "AddComment",

  setup(props, { emit }) {
    const store = inject("store");
    const currentVideoId = ref("");
    const userId = ref("");
    const userImage = ref("");
    const username = ref("");
    const comment = ref("");
    const route = useRoute();

    onMounted(async () => {
      await store.methods.load();
      currentVideoId.value = route.params.id;
      if (store.state.userData) {
        userId.value = store.state.userData._id;
        userImage.value = store.state.userData.userImage;
        username.value = store.state.userData.username;
      }
    });

    const handleCommentUpdate = (e) => {
      comment.value = e.target.value;
    };

    const handleComment = async () => {
      try {
        const currentTime = new Date();
        const response = await fetch(
          `http://localhost:6500/api/videos/comment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              videoId: currentVideoId.value,
              userId: userId.value,
              userImage: userImage.value,
              username: username.value,
              comment: comment.value,
              createdAt: currentTime,
            }),
          }
        );
        const result = await response.json();
        if (result.success) {
          emit("commentAdded");
          comment.value = "";
        }
      } catch (error) {
        console.log(error);
      }
    };

    return {
      store,
      userId,
      userImage,
      username,
      comment,
      currentVideoId,
      handleCommentUpdate,
      handleComment,
    };
  },
};
</script>

<style scoped>
input {
  position: relative;
  width: 85%;
  border-radius: 6px;
  font-size: 12px;
  padding: 6px;
  border: 1px solid #ba2f74;
}
input::placeholder {
  font-size: 12px;
  padding-left: 6px;
}
input:focus {
  outline: none;
}
</style>
