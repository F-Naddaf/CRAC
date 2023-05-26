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
import { ref, inject, onMounted, computed } from "vue";

export default {
  name: "Tabs",
  components: {
    Videos,
  },
  setup(props) {
    const store = inject("store");
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
        case "unPosted":
          return unPosted.value;
        case "posted":
          return posted.value;
        case "saved":
          return saved.value;
        case "favorite":
          return favorite.value;
        default:
          return [];
      }
    });

    const loadVideos = () => {
      const user = store.state.userData;
      if (user && user.mediaUrl) {
        unPosted.value.push(...user.mediaUrl);
        posted.value.push(...user.mediaUrl);
        saved.value.push(...user.mediaUrl);
        favorite.value.push(...user.mediaUrl);
      }
    };

    onMounted(async () => {
      await store.methods.load();
      loadVideos();
    });

    return {
      store,
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
}
</style>
