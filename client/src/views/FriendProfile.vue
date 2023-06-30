<template>
  <div v-if="isLoading" class="mt-20 flex justify-center">
    <img src="../../public//img//spinner.svg" alt="loading" />
  </div>
  <div v-else class="w-full h-full flex flex-col relative">
    <section class="w-full h-1/3">
      <FriendInfo
        :userFullName="userFullName"
        :username="username"
        :email="email"
        :userImage="userImage"
        :numberOfFollowers="numberOfFollowers"
      />
    </section>
    <section class="w-full h-2/3 overflow-y-auto -mt-8">
      <span id="friend-video-line"></span>
      <Videos :videos="videos" />
    </section>
    <div class="bg-black">
      <NavBar />
    </div>
  </div>
</template>

<script>
import FriendInfo from "../components/friendProfile/FriendInfo.vue";
import Videos from "../components/profile/Videos.vue";
import NavBar from "../components/NavBar.vue";
import FollowerList from "@/components/profile/FollowerList.vue";
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "FriendProfile",
  components: {
    FriendInfo,
    Videos,
    NavBar,
    FollowerList,
  },
  setup() {
    const id = ref("");
    const userFullName = ref("");
    const username = ref("");
    const email = ref("");
    const userImage = ref("");
    const numberOfFollowers = ref("");
    const videos = ref([]);
    const isLoading = ref(true);
    const followers = ref([]);

    const route = useRoute();

    onMounted(async () => {
      id.value = route.params.id;
    });

    watch([id], () => {
      getFriendDetails();
    });

    const getFriendDetails = async () => {
      isLoading.value = true;
      try {
        const token = localStorage.getItem("accessToken");
        const userResponse = await fetch(
          `http://localhost:6500/api/users/${id.value}`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (userResponse.ok) {
          const result = await userResponse.json();
          const userFirstName = result.user?.firstname;
          const userLastName = result.user?.lastname;

          userFullName.value = `${userFirstName} ${userLastName}`;
          username.value = result.user?.username;
          email.value = result.user?.email;
          userImage.value = result.user?.userImage;
          followers.value = result.user?.followers;
          numberOfFollowers.value = result.user?.followers.length;
          videos.value = result.videos;
          isLoading.value = false;
        } else {
          throw new Error("Failed to retrieve user data");
        }
      } catch (error) {
        console.error(error);
      }
    };

    return {
      userFullName,
      username,
      email,
      userImage,
      followers,
      videos,
      id,
      isLoading,
      numberOfFollowers,
      getFriendDetails,
    };
  },
};
</script>

<style scpoed>
#friend-video-line {
  display: flex;
  justify-content: space-between;
  padding: 0 50px;
  align-items: center;
  border-bottom: 1px solid #8c999e;
}
</style>
