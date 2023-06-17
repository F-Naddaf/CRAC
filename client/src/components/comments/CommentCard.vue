<template>
  <div class="self-start h-full">
    <div
      class="w-full flex mb-12 ml-3.5"
      v-for="comment in comments"
      :key="comment._id"
    >
      <router-link
        :to="`/profile/${comment.userId}`"
        class="flex flex-col w-8 mt-1 mr-2 items-center"
      >
        <div
          class="flex items-center justify-center bg-gray-700 rounded-full w-7 h-7 justify-center border-2 border-gray-200 overflow-hidden"
        >
          <img
            v-if="comment.userImage"
            :src="comment.userImage"
            class="h-12 object-cover w-7 h-7"
          />
          <i v-else class="fa-solid fa-user text-gray-200 text-md"></i>
        </div>
        <p class="text-xs text-primary-100">
          {{ shortUsername(comment.username) }}
        </p>
      </router-link>
      <div class="relative w-5/6 ml-1">
        <div class="comment-wrapper">
          <p
            class="text-left text-sm"
            :contentEditable="comment.editing"
            :class="{ editable: comment.editing }"
            :data-comment-id="comment._id"
            @input="comment.editedComment = $event.target.innerText"
            @keydown.enter.prevent="saveEditing(comment._id)"
            @keydown="handleKeyDown($event, comment._id)"
          >
            {{ comment.editing ? comment.editedComment : comment.comment }}
          </p>
          <div v-if="userId === comment.userId" class="flex w-full justify-end">
            <div class="w-auto mt-2">
              <button
                class="text-xs bg-red-700 px-2 py-1 rounded text-gray-300 mx-2"
                @click="deleteComment(comment._id)"
              >
                Delete
              </button>
              <button
                class="edit text-xs px-2 py-1 rounded text-gray-300"
                @click="startEditing(comment._id)"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-1 ml-2">
          {{ formattedTime(comment.createdAt) }}
        </p>
        <LikeUnlikeButton
          :commentId="comment._id"
          :videoId="comment.videoId"
          :likes="comment.likes"
          :unlikes="comment.unlikes"
          :userId="comment.userId"
          :amountOfLike="comment.amountOfLike"
          :amountOfUnlike="comment.amountOfUnlike"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, inject, nextTick } from "vue";
import LikeUnlikeButton from "./LikeUnlikeButton.vue";

export default {
  name: "CommentCard",
  props: {
    comments: Array,
  },
  components: {
    LikeUnlikeButton,
  },
  setup(props, { emit }) {
    const store = inject("store");
    const userId = ref("");

    onMounted(async () => {
      await store.methods.load();
      userId.value = store.state.userData?._id;
    });

    const formattedTime = (commentTimestamp) => {
      const commentTime = new Date(commentTimestamp);
      const currentTime = new Date();
      const timeDifference = currentTime - commentTime;

      if (timeDifference < 60000) {
        return `${Math.floor(timeDifference / 1000)} S`;
      } else if (timeDifference < 3600000) {
        return `${Math.floor(timeDifference / 60000)} M`;
      } else if (timeDifference < 86400000) {
        return `${Math.floor(timeDifference / 3600000)} H`;
      } else if (timeDifference < 2592000000) {
        return `${Math.floor(timeDifference / 86400000)} D`;
      } else if (timeDifference < 31536000000) {
        return `${Math.floor(timeDifference / 2592000000)} M`;
      } else {
        return `${Math.floor(timeDifference / 31536000000)} Y`;
      }
    };

    const shortUsername = (username) => {
      if (username.length > 5) {
        return username.substring(0, 5) + "...";
      } else {
        return username;
      }
    };

    const startEditing = (commentId) => {
      const comment = props.comments.find((c) => c._id === commentId);
      if (comment) {
        comment.editing = true;
        comment.editedComment = comment.comment;

        nextTick(() => {
          const inputField = document.querySelector(
            `.comment-wrapper [data-comment-id="${comment._id}"]`
          );
          if (inputField) {
            inputField.focus();
          }
        });
      }
    };

    const saveEditing = async (commentId) => {
      const comment = props.comments.find((c) => c._id === commentId);
      if (comment) {
        const editedComment = comment.editedComment;
        comment.editing = false;
        comment.comment = editedComment;
        try {
          const response = await fetch(
            `http://localhost:6500/api/videos/comment/${comment._id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                editedComment: editedComment,
              }),
            }
          );
          await response.json();
        } catch (error) {
          console.log(error);
        }
      }
    };

    const deleteComment = async (commentId) => {
      const comment = props.comments.find((c) => c._id === commentId);
      if (comment) {
        try {
          const response = await fetch(
            `http://localhost:6500/api/videos/comment/${comment._id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const result = await response.json();
          if (result.success) {
            emit("commentDeleted");
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    const cancelEditing = (comment) => {
      comment.editing = false;
      comment.editedComment = comment.comment;
    };

    const handleKeyDown = (event, commentId) => {
      if (event.key === "Escape") {
        const comment = props.comments.find((c) => c._id === commentId);
        if (comment) {
          cancelEditing(comment);
        }
      }
    };

    return {
      store,
      userId,
      formattedTime,
      shortUsername,
      startEditing,
      saveEditing,
      cancelEditing,
      handleKeyDown,
      deleteComment,
    };
  },
};
</script>

<style scoped>
.comment-wrapper {
  min-width: 360px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  padding: 10px;
  background-color: rgb(223 223 223);
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.2) 1.95px 1.95px 2.6px;
}

.comment-wrapper::before {
  content: "";
  position: absolute;
  left: -12px;
  top: 14px;
  width: 0;
  height: 0;
  border-right: 12px solid rgb(223 223 223);
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
}
.edit {
  background-color: green;
}
.editable {
  color: #02a2ec;
}
.comment-wrapper p:focus {
  outline: none;
  border: none;
}
</style>
