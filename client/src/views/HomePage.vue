<template>
  <div class="w-full h-screen relative">
    <div class="flex w-full justify-between items-center" id="head">
      <div class="input-container">
        <input type="search" class="search-input" />
        <div class="search-container">
          <i class="fa-solid fa-magnifying-glass"></i>
          <p class="search">Search...</p>
        </div>
      </div>
      <div class="logo-container">
        <DanceAnimation />
      </div>
    </div>
    <div class="video-container">
      <div class="video-section">
        <div class="relative" v-for="(video, index) in videos" :key="video._id">
          <video
            @click="handleScroll"
            v-if="index === currentVideoIndex"
            loop
            autoplay
            class="video"
            :ref="getVideoRef(index)"
            :data-index="index"
          >
            <source class="source" :src="video.url" type="video/mp4" />
          </video>
          <div
            class="absolute bottom-10 right-4 z-30"
            v-if="index === currentVideoIndex"
          >
            <SideNav
              @toggle-share-container="toggleShareContainer"
              :videoId="currentVideoId"
              :amountOfLike="videos[currentVideoIndex].amountOfLike"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="nav-container">
      <NavBar />
    </div>
    <div v-if="openShareMedia !== null" class="open-social-media">
      <SocialMedia
        :isClosed="isSocialMediaClosed"
        @close="isSocialMediaClosed = true"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch, nextTick } from "vue";
import NavBar from "../components/NavBar.vue";
import SideNav from "../components/SideNav.vue";
import SocialMedia from "../components/SocialMedia.vue";
import DanceAnimation from "../components/DanceAnimation.vue";

export default {
  name: "HomePage",
  components: {
    NavBar,
    SideNav,
    SocialMedia,
    DanceAnimation,
  },
  setup() {
    const openShareMedia = ref(null);
    const isSocialMediaClosed = ref(false);
    const currentVideoId = ref(null);
    const currentVideoIndex = ref(0);
    const videos = ref([]);
    const videoRefs = ref([]);

    onMounted(async () => {
      await getAllVideos();
      await nextTick();
      observeVideos();
    });

    const getVideoRef = (index) => (el) => {
      videoRefs.value[index] = el;
    };

    const observeVideos = () => {
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      };

      const observer = new IntersectionObserver(handleIntersection, options);

      for (let i = 0; i < videos.value.length; i++) {
        const videoElement = videoRefs.value[i];
        if (videoElement instanceof Element) {
          observer.observe(videoElement);
        }
      }
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const videoIndex = Number(entry.target.dataset.index);
          currentVideoId.value = videos.value[videoIndex]._id;
        }
      });
    };

    watch(currentVideoId, (newVideoId) => {
      const videoIndex = videos.value.findIndex(
        (video) => video._id === newVideoId
      );
      currentVideoIndex.value = videoIndex;
    });

    const getAllVideos = async () => {
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
        videos.value = videosArray;
      } catch (error) {
        console.error(error);
      }
    };

    const toggleShareContainer = () => {
      if (openShareMedia.value === null) {
        openShareMedia.value = true;
      } else {
        openShareMedia.value = !openShareMedia.value;
        isSocialMediaClosed.value = false;
      }
    };

    const handleScroll = () => {
      currentVideoIndex.value++;
      if (currentVideoIndex.value >= videos.value.length) {
        currentVideoIndex.value = 0;
      }
      currentVideoId.value = videos.value[currentVideoIndex.value]._id;
    };

    return {
      openShareMedia,
      isSocialMediaClosed,
      videos,
      getAllVideos,
      toggleShareContainer,
      handleScroll,
      currentVideoIndex,
      currentVideoId,
      videoRefs,
      getVideoRef,
    };
  },
};
</script>

<style scoped>
#head {
  height: 6vh;
}
.input-container {
  position: relative;
  display: flex;
  margin-left: 8px;
  width: 86%;
}
.search-input {
  background: none;
  border: 1px solid #9e9e9e;
  font-size: 14px;
  padding: 2px 5px;
  color: #9e9e9e;
  width: 30%;
  z-index: 10;
  transition: all 0.5s ease;
  float: right;
  border-radius: 5px;
}
.search-input:focus ~ .search-container {
  display: none;
}
.search-input:focus {
  width: 100%;
}
.search-input:focus {
  outline: none;
  border: 1px solid #ba2f74;
}
.search-container {
  position: absolute;
  display: flex;
  align-items: center;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
}
.fa-magnifying-glass {
  font-size: 16px;
  color: #9e9e9e;
  z-index: 5;
}
.search {
  font-size: 14px;
  text-transform: capitalize;
  color: #9e9e9e;
  padding-left: 5px;
  z-index: 5;
}
.logo-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  margin: 8px;
}
.video-container {
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 86vh;
}
.video-section {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}
.image {
  width: 100%;
  height: 100vh;
}
.nav-container {
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 10;
}
.open-social-media {
  width: 100%;
  position: absolute;
  bottom: 0;
  transform: translateY(-200px);
  transition: transform 0.3s ease-in-out;
  z-index: 50;
}
.open-social-media.open {
  transform: translateY(0);
}

.open-social-media.close {
  transform: translateY(-200px);
}
video {
  width: 100%;
  height: 86vh;
}
.video-section video {
  object-fit: cover;
}
</style>
