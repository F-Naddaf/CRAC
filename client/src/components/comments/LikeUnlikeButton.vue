<template>
  <div class="absolute flex right-0 -bottom-1 items-center">
    <p class="xs text-gray-500 pl-3 pr-1">{{ numberOfUnlikes }}</p>
    <button @click="handleUnlike">
      <i
        class="fa-thumbs-down"
        :class="isUnliked ? 'fa-solid' : 'fa-regular'"
      ></i>
    </button>
    <p class="xs text-gray-500 pl-3 pr-1">{{ numberOfLikes }}</p>
    <button @click="handleLike">
      <i class="fa-thumbs-up" :class="isLiked ? 'fa-solid' : 'fa-regular'"></i>
    </button>
  </div>
</template>

<script>
import { ref, inject, onMounted } from "vue";

export default {
  name: "LikeUnlikeButton",
  props: {
    commentId: String,
    videoId: String,
    likes: {
      type: Array,
      default: 0,
    },
    unlikes: {
      type: Array,
      default: 0,
    },
    userId: String,
  },

  setup(props) {
    const store = inject("store");
    const numberOfLikes = ref(props.likes.length);
    const numberOfUnlikes = ref(props.unlikes.length);
    const currentUserId = ref("");
    const isLiked = ref(null);
    const isUnliked = ref(null);

    const likedBefore = () => {
      const findUser = props.likes.some(
        (like) => like.userId === currentUserId.value
      );
      isLiked.value = findUser;
    };

    const unlikedBefore = () => {
      const findUser = props.unlikes.some(
        (unlike) => unlike.userId === currentUserId.value
      );
      isUnliked.value = findUser;
    };

    onMounted(async () => {
      await store.methods.load();
      currentUserId.value = store.state.userData?._id;
      likedBefore();
      unlikedBefore();
    });

    const handleLike = async () => {
      try {
        const response = await fetch(
          `http://localhost:6500/api/videos/like/${props.commentId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              videoId: props.videoId,
              userId: currentUserId.value,
            }),
          }
        );
        const result = await response.json();
        if (result.success) {
          isLiked.value = !isLiked.value;
          numberOfLikes.value = isLiked.value
            ? numberOfLikes.value + 1
            : numberOfLikes.value - 1;
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handleUnlike = async () => {
      try {
        const response = await fetch(
          `http://localhost:6500/api/videos/unlike/${props.commentId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              videoId: props.videoId,
              userId: currentUserId.value,
            }),
          }
        );
        const result = await response.json();
        if (result.success) {
          isUnliked.value = !isUnliked.value;
          numberOfUnlikes.value = isUnliked.value
            ? numberOfUnlikes.value + 1
            : numberOfUnlikes.value - 1;
        }
      } catch (error) {
        console.log(error);
      }
    };

    return {
      store,
      numberOfLikes,
      numberOfUnlikes,
      currentUserId,
      isLiked,
      isUnliked,
      likedBefore,
      unlikedBefore,
      handleLike,
      handleUnlike,
    };
  },
};
</script>

<style scoped>
.fa-regular {
  color: rgb(168, 168, 168);
}
.fa-solid {
  color: #167199;
}
</style>
