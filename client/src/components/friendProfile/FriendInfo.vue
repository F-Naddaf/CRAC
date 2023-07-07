<template>
  <div class="w-full h-full flex flex-col items-center relative">
    <section class="flex relative w-full h-10">
      <div class="header-container">
        <h1 class="user-name">{{ userFullName }}</h1>
      </div>
    </section>
    <section class="flex w-full p-8 justify-center">
      <div
        v-if="!userImage"
        class="flex items-center justify-center w-28 h-28 rounded-full bg-background"
      >
        <i class="fa-solid fa-user text-gray-200 text-7xl"></i>
      </div>
      <div
        v-else
        class="w-28 h-28 flex items-center justify-center rounded-full bg-background overflow-hidden border border-primary-100"
      >
        <img id="user-image" :src="userImage" />
      </div>
      <div class="px-4 mt-4 relative">
        <p class="userDetails">#{{ username }}</p>
        <p class="userDetails">{{ email }}</p>
        <div v-if="userFullName" class="edit-image"></div>
      </div>
    </section>
    <div>
      <div class="flex items-center">
        <p class="text-sm font-light text-primary-200 pr-2">
          Followers
        </p>
        <p class="font-semibold text-primary-200">{{ numberOfFollowers }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FriendInfo",

  props: {
    userFullName: String,
    username: String,
    email: String,
    userImage: String,
    numberOfFollowers: Number,
  },
};
</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 220px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.logout-container {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  border: 1px solid #8c999e;
  padding: 4px;
  border-radius: 9px;
}
.logout-btn {
  display: flex;
  align-items: center;
}

.logout-btn i {
  color: #8c999e;
  padding-right: 3px;
  font-size: 10px;
  padding-bottom: 2px;
}
.logout-btn p {
  font-size: 10px;
  color: #8c999e;
}
#user-image {
  height: 110px;
  max-width: 200%;
}
.edit-image-btn {
  position: absolute;
  left: -15px;
  bottom: 5px;
}
.edit-image button {
  display: flex;
  align-items: center;
}
.edit-image i {
  color: #28bfd2;
  padding-right: 3px;
  font-size: 12px;
  padding-top: 2px;
}
.edit-profile-btn {
  display: flex;
  align-items: center;
  background-color: #28bfd2;
  border-radius: 12px;
  padding: 6px;
}
.edit-profile-btn p {
  font-size: 18px;
  color: #e67cb1;
}
</style>
