<template>
  <div class="social-media-container" :class="{ 'slide-up': show }">
    <div class="social-media-header">
      <h3 class="share-title">Share via</h3>
      <i class="fa-solid fa-circle-xmark" @click="closeSocialMedia"></i>
    </div>
    <button
      class="facebook social"
      @click="shareToFacebook"
      :href="state.facebookLink"
    >
      <img src="https://i.ibb.co/nzdYVs5/facebook.png" alt="facebook" />
      <p>Facebook</p>
    </button>
    <button
      class="messenger social"
      @click="shareToMessenger"
      :href="state.messengerLink"
    >
      <span>
        <img src="https://i.ibb.co/2WJ1NhQ/messenger.png" alt="messenger" />
      </span>
      <p>Messenger</p>
    </button>
    <button
      class="whatsapp social"
      @click="shareToWhatsapp"
      :href="state.whatsappLink"
    >
      <img src="https://i.ibb.co/vd8g99B/whatsapp.png" alt="whatsapp" />
      <p>Whatsapp</p>
    </button>
    <button
      class="twitter social"
      @click="shareToTwitter"
      :href="state.twitterLink"
    >
      <img src="https://i.ibb.co/n88DB2P/twitter.png" alt="twitter" />
      <p>Twitter</p>
    </button>
    <button
      class="instagram social"
      @click="shareToInstagram"
      :href="state.instagramLink"
    >
      <img src="https://i.ibb.co/kMfr9F5/instagram.png" alt="instagram" />
      <p>Instagram</p>
    </button>
    <button class="email social" @click="shareToEmail" :href="state.emailLink">
      <img src="https://i.ibb.co/S3wHVqY/email.png" alt="email" />
      <p>Email</p>
    </button>
    <button class="sms social" @click="shareToSMS" :href="state.smsLink">
      <img src="https://i.ibb.co/0ZSJWv7/sms.png" alt="sms" />
      <p>SMS</p>
    </button>
  </div>
</template>

<script>
import { reactive } from "vue";

export default {
  name: "SocialMedia",
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
    const state = reactive({
      facebookLink: "",
      messengerLink: "",
      whatsappLink: "",
      twitterLink: "",
      instagramLink: "",
      emailLink: "",
      smsLink: "",
      show: false,
    });

    const shareToFacebook = () => {
      const url = `https://example/${props.videoId}/home.com`;
      state.facebookLink = `https://www.facebook.com/share.php?u=${url}`;
      window.open(state.facebookLink);
    };
    const shareToMessenger = () => {
      const url = "https://example.com";
      state.messengerLink = `https://www.facebook.com/dialog/send?link=${url}&app_id=1234567890`;
      window.open(state.messengerLink);
    };
    const shareToWhatsapp = () => {
      const url = `https://example/${props.videoId}/home.com`;
      const message = "Sharing a video from CRAC";
      state.whatsappLink = `https://wa.me/?text=${message}%20${url}`;
      window.open(state.whatsappLink);
    };

    const shareToTwitter = () => {
      const url = "https://example.com";
      const message = "Sharing a video from CRAC";
      state.twitterLink = `https://twitter.com/share?url=${url}&text=${message}&hashtags=${""}`;
      window.open(state.twitterLink);
    };

    const shareToInstagram = () => {
      const url = "https://example.com";
      state.instagramLink = `https://www.instagram.com/share?url=${url}&caption=${""}`;
      window.open(state.instagramLink);
    };

    const shareToEmail = () => {
      const url = "https://example.com";
      const body = encodeURIComponent(
        `Hi,\n\nI wanted to share this link with you: ${url}\n\nEnjoy!`
      );
      const subject = "Sharing a video from CRAC";
      state.emailLink = `mailto:?subject=${subject}&body=${body}`;
      window.open(state.emailLink);
    };
    const shareToSMS = () => {
      if (!/Mobi/i.test(navigator.userAgent)) {
        alert("This feature is available for mobile devices only");
        return;
      }
      const url = "https://example.com";
      const message = "Sharing a video from CRAC";
      state.smsLink = `sms:?body=${message} ${url}`;
      window.open(state.smsLink);
    };

    const closeSocialMedia = () => {
      emit("closeClicked");
    };

    return {
      state,
      shareToFacebook,
      shareToMessenger,
      shareToWhatsapp,
      shareToTwitter,
      shareToInstagram,
      shareToEmail,
      shareToSMS,
      closeSocialMedia,
    };
  },
};
</script>

<style scoped>
.social-media-container {
  position: absolute;
  bottom: -210px;
  left: 0;
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
  z-index: 100;
}
.slide-up {
  bottom: -2px;
  z-index: 100;
}
.social-media-header {
  display: grid;
  position: relative;
  width: 100%;
  grid-column: 1 / -1;
  justify-content: center;
}
.share-title {
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
.social-media-container > .social {
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

.social-media-container p {
  font-size: 10px;
  padding-top: 5px;
}
.messenger span {
  display: flex;
  border: 1px solid #afafaf;
  border-radius: 50%;
}
.messenger span img {
  padding: 6px;
}
</style>
