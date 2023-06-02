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
    <Videos :videos="filteredVideos"></Videos>
  </div>
</template>

<script>
import Videos from "./Videos.vue";
import { ref, onMounted, computed } from "vue";

export default {
  name: "Tabs",
  components: {
    Videos,
  },
  setup(props) {
    const unPosted = ref([]);
    const posted = ref([]);
    const saved = ref([]);
    const favorite = ref([]);
    const activeCategory = ref("Unposted");

    const selectCategory = (category) => {
      activeCategory.value = category;
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
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch("http://localhost:6500/api/videos", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await response.json();
        const videosArray = json.videos;
        const getPostedVideos = videosArray.filter(
          (media) => media.posted === true
        );
        const getUnPostedVideos = videosArray.filter(
          (media) => media.posted === false
        );
        console.log("getUnPostedVideos", getUnPostedVideos);
        posted.value.push(...getPostedVideos);
        unPosted.value.push(...getUnPostedVideos);
      } catch (error) {
        console.error(error);
      }
    };

    onMounted(async () => {
      loadVideos();
    });

    return {
      unPosted,
      posted,
      saved,
      favorite,
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
