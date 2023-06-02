<!-- VideoSection Code:
<template>
  <div class="video-section">
    <div>
      <img class="video" src="http//:www.google.com" />
      <div class="absolute bottom-10 right-4 z-30">
        <SideNav @shareClicked="toggleSocialMedia" />
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from "vue";

import SideNav from "@/components/home/SideNav.vue";
export default {
  name: "VideoSection",
  components: {
    SideNav,
  },
  setup(props) {
    const instance = getCurrentInstance();
    const emit = instance.emit;

 
    const toggleSocialMedia = () => {
      emit("shareClicked");
    }
    return {
      toggleSocialMedia
    }
  }
};
</script>

SideNav Code:
<template>
  <div class="buttons">
    <button class="iconCard pt-10">
      <i class="fa-solid fa-comment-dots"></i>
    </button>
    <button class="iconCard pt-10">
      <i class="fa-solid fa-bookmark"></i>
    </button>
    <button class="iconCard pt-10" @click="$emit('shareClicked')">
      <i class="fa-solid fa-share"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: "SideNav",
};
</script>

HomePage Code:
<template>
  <div class="home">
    <VideoSection @shareClicked="toggleSocialMedia" />
    <div class="nav-container">
      <NavBar />
    </div>
    <div>
      <SocialMedia :show="showSocialMedia" @closeClicked="closeSocialMedia" />
    </div>
  </div>
</template>

<script>
import VideoSection from "@/components/home/VideoSection.vue";
import NavBar from "@/components/NavBar.vue";
import SocialMedia from "@/components/home/SocialMedia.vue";
export default {
  name: "HomePage",
  components: {
    VideoSection,
    NavBar,
    SocialMedia,
  },
  data() {
    return {
      showSocialMedia: false,
    };
  },
  methods: {
  toggleSocialMedia() {
    this.showSocialMedia = !this.showSocialMedia;
  },
  closeSocialMedia() {
    this.showSocialMedia = false;
  },
},

};
</script>

SocialMedia Code:
<template>
  <div class="social-media-container" :class="{ 'slide-up': !show }">
    <i class="fa-solid fa-circle-xmark" @click="closeSocialMedia"></i>
    <div class="buttons-container">
      <button class="facebook social">
        <img src="https://i.ibb.co/nzdYVs5/facebook.png" alt="facebook" />
        <p>Facebook</p>
      </button>
      <button class="messenger social">
        <span>
          <img src="https://i.ibb.co/2WJ1NhQ/messenger.png" alt="messenger" />
        </span>
        <p>Messenger</p>
      </button>
      <button class="whatsapp social">
        <img src="https://i.ibb.co/vd8g99B/whatsapp.png" alt="whatsapp" />
        <p>Whatsapp</p>
      </button>
      <button class="twitter social">
        <img src="https://i.ibb.co/n88DB2P/twitter.png" alt="twitter" />
        <p>Twitter</p>
      </button>
      <button class="instagram social">
        <img src="https://i.ibb.co/kMfr9F5/instagram.png" alt="instagram" />
        <p>Instagram</p>
      </button>
      <button class="email social">
        <img src="https://i.ibb.co/S3wHVqY/email.png" alt="email" />
        <p>Email</p>
      </button>
      <button class="sms social">
        <img src="https://i.ibb.co/0ZSJWv7/sms.png" alt="sms" />
        <p>SMS</p>
      </button>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
export default {
  name: "SocialMedia",
  props: {
    isClosed: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const state = reactive({
      show: false,
    });

    const closeSocialMedia = () => {
      show = false;
    };
    return {
      closeSocialMedia,
    };
  },
};
</script>
<style scoped>
.social-media-container {
  position: fixed;
  bottom: -200px;
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-items: center;
  align-content: center;
  gap: 20px;
  width: 100%;
  height: 200px;
  padding: 0 25px;
  background-color: rgba(255, 255, 255, 0.9);
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  transition: bottom 0.3s ease-in-out;
}

.slide-up {
  bottom: 200px;
  transition: bottom 0.3s ease-in-out;
}
</style> -->
