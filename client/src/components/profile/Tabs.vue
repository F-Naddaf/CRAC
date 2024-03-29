<template>
  <div>
    <ul>
      <li>
        <button @click="selectCategory('Unposted')">
          <p v-show="activeCategory === 'Unposted'" class="tab-label">
            {{ activeCategory }}
          </p>
          <i
            class="fa-regular fa-folder-open"
            :class="{ active: isActiveCategory('Unposted') }"
          ></i>
        </button>
      </li>
      <li>
        <button @click="selectCategory('Posted')">
          <p v-show="activeCategory === 'Posted'" class="tab-label">
            {{ activeCategory }}
          </p>
          <i
            class="fa-solid fa-cloud-arrow-up"
            :class="{ active: isActiveCategory('Posted') }"
          ></i>
        </button>
      </li>
      <li>
        <button @click="selectCategory('Saved')">
          <p v-show="activeCategory === 'Saved'" class="tab-label">
            {{ activeCategory }}
          </p>
          <i
            class="fa-solid fa-bookmark text-2xl"
            :class="{ active: isActiveCategory('Saved') }"
          ></i>
        </button>
      </li>
      <li>
        <button @click="selectCategory('Favorite')">
          <p v-show="activeCategory === 'Favorite'" class="tab-label">
            {{ activeCategory }}
          </p>
          <i
            class="fa-solid fa-heart text-2xl"
            :class="{ active: isActiveCategory('Favorite') }"
          ></i>
        </button>
      </li>
    </ul>
    <div v-if="videoIsLoad" class="mt-20 flex justify-center">
      <img src="../../../public//img//spinner.svg" alt="loading" />
    </div>
    <Videos :videos="filteredVideos" :userCate="userCate"></Videos>
  </div>
</template>

<script>
import Videos from "./Videos.vue";
import { ref, inject, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "Tabs",
  components: {
    Videos,
  },
  setup(props) {
    const router = useRouter();
    const store = inject("store");
    const unPosted = ref([]);
    const posted = ref([]);
    const saved = ref([]);
    const favorite = ref([]);
    const userId = ref("");
    const userCate = ref(false);
    const videoIsLoad = ref(null);
    const activeCategory = ref("Unposted");

    const selectCategory = (category) => {
      activeCategory.value = category;
      if (category === "Unposted" || category === "Posted") {
        userCate.value = false;
      } else {
        userCate.value = true;
      }
    };

    const isActiveCategory = (category) => {
      return activeCategory.value === category;
    };

    const filteredVideos = computed(() => {
      switch (activeCategory.value) {
        case "Unposted":
          return unPosted.value;
        case "Posted":
          return posted.value;
        case "Saved":
          return saved.value;
        case "Favorite":
          return favorite.value;
        default:
          return [];
      }
    });

    const loadVideos = async () => {
      videoIsLoad.value = true;
      userId.value = router.currentRoute.value.params.id;
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch(
          `https://crac-server.onrender.com/api/videos/getMedia/${userId.value}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await response.json();
        const videosArray = json.videos;
        const getPostedVideos = videosArray.filter(
          (media) => media.posted === true
        );
        const getUnPostedVideos = videosArray.filter(
          (media) => media.posted === false
        );

        await store.methods.load();
        const userFavorite = store.state.userData?.favoriteVideos;
        const userSavedVideos = store.state.userData?.savedVideos;

        posted.value.push(...getPostedVideos);
        unPosted.value.push(...getUnPostedVideos);
        saved.value.push(...userSavedVideos);
        favorite.value.push(...userFavorite);
        videoIsLoad.value = false;
      } catch (error) {
        console.error(error);
      }
    };

    onMounted(async () => {
      await store.methods.load();
      loadVideos();
    });

    return {
      store,
      userId,
      unPosted,
      posted,
      userCate,
      saved,
      favorite,
      videoIsLoad,
      selectCategory,
      isActiveCategory,
      activeCategory,
      filteredVideos,
      loadVideos,
    };
  },
};
</script>

<style scoped>
ul {
  display: flex;
  justify-content: space-between;
  padding: 0 50px;
  align-items: center;
  border-bottom: 1px solid #8c999e;
}
li {
  display: flex;
  height: 32px;
}
i {
  color: #8c999e;
  font-size: 18px;
}
.active {
  color: #e67cb1;
}
button {
  position: relative;
}
.tab-label {
  position: absolute;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%);
  font-size: 10px;
  color: #e67cb1;
  z-index: 100;
}
</style>
