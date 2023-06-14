<template>
  <div class="comments-container" :class="{ 'slide-up': show }">
    <div class="comment-header">
      <h3 class="comment-title">Comments</h3>
      <i class="fa-solid fa-circle-xmark" @click="closeComment"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "Comment",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    videoId: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const closeComment = () => {
      emit("closeClicked");
    };

    return {
      closeComment,
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
  align-content: center;
  width: 100%;
  height: 45vh;
  padding: 0 25px;
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
  top: 5px;
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
</style>
