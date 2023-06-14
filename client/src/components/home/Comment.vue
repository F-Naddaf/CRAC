<template>
  <div class="comments-container" :class="{ 'slide-up': show }">
    <div class="comment-header">
      <h3 class="comment-title">Comments</h3>
      <i class="fa-solid fa-circle-xmark" @click="closeComment"></i>
    </div>
    <div>
      <form class="flex items-center w-full" @submit.prevent="handleComment">
        <div
          class="flex items-center justify-center bg-gray-700 mr-2 rounded-full w-10 h-10 justify-center border-2 border-gray-200 overflow-hidden"
        >
          <img v-if="userImage" :src="userImage" class="h-12 object-cover" />
        </div>
        <input
          class="comment-input"
          type="text"
          placeholder="Add comment..."
          v-model="comment"
          @input="handleCommentUpdate"
        />
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, inject } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "Comment",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
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
      userId.value = store.state.userData?._id;
      userImage.value = store.state.userData?.userImage;
      username.value = store.state.userData?.username;
      console.log("videoId", currentVideoId.value);
      console.log("userId", userId.value);
      console.log("userImage", userImage.value);
      console.log("username", username.value);
    });

    const closeComment = () => {
      emit("closeClicked");
    };

    const handleCommentUpdate = (e) => {
      comment.value = e.target.value;
    };

    const handleComment = async () => {
      try {
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
            }),
          }
        );
        const result = await response.json();
        if (result.success) {
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
      closeComment,
      handleComment,
    };
  },
};
</script>

<style scoped>
.comments-container {
  position: absolute;
  bottom: -40vh;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-items: center;
  justify-content: space-between;
  align-content: center;
  width: 100%;
  height: 45vh;
  padding: 8px 25px;
  background-color: rgba(255, 255, 255, 0.9);
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  transition: bottom 0.3s ease-in-out;
  z-index: 100;
}
.comment-header {
  display: grid;
  position: relative;
  width: 100%;
  grid-column: 1 / -1;
  justify-content: center;
}
.comment-title {
  align-self: center;
  margin-top: -10px;
  padding: 10px;
  font-size: 12px;
}
.fa-circle-xmark {
  position: absolute;
  right: -15px;
  color: #ba2f74;
  cursor: pointer;
}
.comment-container > .comment {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-bottom: 25px;
  cursor: pointer;
}
.slide-up {
  bottom: -2px;
  transition: bottom 0.3s ease-in-out;
  z-index: 100;
}
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
