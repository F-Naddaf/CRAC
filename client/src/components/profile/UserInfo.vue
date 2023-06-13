<template>
  <div class="w-full h-full flex flex-col items-center">
    <section class="flex relative w-full h-10">
      <div class="header-container">
        <h1 class="user-name">{{ userFullName }}</h1>
      </div>
      <div class="logout-container">
        <router-link
          :to="`/login`"
          @click="store.methods.logout"
          class="logout-btn"
        >
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
          <p>Logout</p>
        </router-link>
      </div>
    </section>
    <section class="flex w-full p-8 justify-center items-center">
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
      <div class="px-4">
        <p class="userDetails">#{{ username }}</p>
        <p class="userDetails">{{ email }}</p>
      </div>
    </section>
    <section v-if="id" class="flex w-full items-center justify-center">
      <router-link :to="`/edit/${id}`" class="m-4">
        <p class="text-sm font-light text-primary-200 underline">
          Edit Profile
        </p>
      </router-link>
      <span class="text-primary-200">|</span>
      <button class="flex items-center m-4" @click="showFollowerList">
        <p class="text-sm font-light text-primary-200 underline pr-2">
          Followers
        </p>
        <p class="font-semibold text-primary-200">{{ numberOfFollowers }}</p>
      </button>
    </section>
    <div v-if="showList === true">
      <FollowerList :show="showList" :id="id" @close="showList = false" />
    </div>
  </div>
</template>

<script>
import { ref, inject, onMounted } from "vue";
import FollowerList from "@/components/profile/FollowerList.vue";

export default {
  components: {
    FollowerList,
  },
  name: "UserInfo",
  setup() {
    const store = inject("store");
    const id = ref("");
    const videoId = ref("");
    const userFullName = ref("");
    const username = ref("");
    const email = ref("");
    const userImage = ref("");
    const followers = ref([]);
    const numberOfFollowers = ref(0);
    const showList = ref(false);

    onMounted(async () => {
      await store.methods.load();
      const userFirstName = store.state.userData?.firstname;
      const userLastName = store.state.userData?.lastname;

      id.value = store.state.userData?._id;
      videoId.value = store.state.userData?.videoId;
      userFullName.value = `${userFirstName} ${userLastName}`;
      username.value = store.state.userData?.username;
      email.value = store.state.userData?.email;
      userImage.value = store.state.userData?.userImage;
      followers.value = store.state.userData?.followers;
      numberOfFollowers.value = followers.value.length;
    });

    const showFollowerList = () => {
      showList.value = !showList.value;
    };

    const closeFollowerList = () => {
      showList.value = false;
    };

    return {
      store,
      id,
      videoId,
      userFullName,
      username,
      email,
      userImage,
      followers,
      numberOfFollowers,
      showList,
      showFollowerList,
      closeFollowerList,
    };
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
</style>
