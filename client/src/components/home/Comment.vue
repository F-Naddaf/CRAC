<template>
  <div class="comments-container" :class="{ 'slide-up': show }">
    <div v-if="isLoading" class="mt-20 flex justify-center">
      <img src="../../../public/img/spinner.svg" alt="loading" />
    </div>
    <div class="relative w-full h-full flex flex-col items-center">
      <section class="comment-header">
        <h3 class="comment-title">Comments</h3>
        <i class="fa-solid fa-circle-xmark" @click="closeComment"></i>
      </section>
      <section class="w-full h-full flex flex-col overflow-scroll">
        <CommentCard
          :comments="comments"
          :currentVideoId="currentVideoId"
          @commentDeleted="handleCommentDeleted"
        />
      </section>
      <section class="add-comment">
        <AddComment @commentAdded="handleCommentAdded" />
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import CommentCard from "@/components/comments/CommentCard.vue";
import AddComment from "@/components/comments/AddComment.vue";

export default {
  name: "Comment",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    CommentCard,
    AddComment,
  },
  setup(props, { emit }) {
    const currentVideoId = ref("");
    const comments = ref([]);
    const isLoading = ref(false);
    const route = useRoute();

    onMounted(async () => {
      currentVideoId.value = route.params.id;
      await getComments();
    });

    watch(currentVideoId, async (newVideoId) => {
      comments.value = [];
      isLoading.value = true;
      await getComments();
    });

    const closeComment = () => {
      emit("closeClicked");
    };

    const handleCommentAdded = () => {
      getComments();
    };

    const handleCommentDeleted = () => {
      getComments();
    };

    const getComments = async () => {
      try {
        isLoading.value = true;
        const response = await fetch(
          `https://crac-server.onrender.com/api/videos/show-comments/${currentVideoId.value}`
        );
        const result = await response.json();
        comments.value = result.comments;
        emit("commentsAmount", comments.value.length);
        isLoading.value = false;
      } catch (error) {
        console.log(error);
      }
    };

    return {
      currentVideoId,
      isLoading,
      comments,
      closeComment,
      handleCommentAdded,
      handleCommentDeleted,
    };
  },
};
</script>

<style scoped>
.comments-container {
  position: absolute;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-items: center;
  width: 100%;
  height: 45vh;
  background-color: rgb(243, 243, 243);
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  overflow: hidden;
}

.overflow-scroll::-webkit-scrollbar {
  display: none;
}
.comment-header {
  display: grid;
  position: sticky;
  top: 0;
  height: 30px;
  width: 100%;
  grid-column: 1 / -1;
  justify-content: center;
  margin-bottom: 20px;
  background-color: rgb(243, 243, 243);
  z-index: 10;
}
.comment-title {
  align-self: center;
  margin-top: -10px;
  padding: 15px;
  font-size: 12px;
}
.fa-circle-xmark {
  position: absolute;
  right: 8px;
  color: #ba2f74;
  cursor: pointer;
  top: 5px;
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
.add-comment {
  position: sticky;
  bottom: 0;
  width: 100%;
  height: 60px;
  padding: 8px 20px;
  background-color: rgb(243, 243, 243);
}
</style>
