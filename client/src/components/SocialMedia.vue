<template>
  <div :class="{ 'social-media-container': true, closed: isClosed }">
    <div class="social-media-header">
      <h3 class="share-title">Share via</h3>
      <i
        class="fa-solid fa-circle-xmark"
        :class="{ close: isClosed }"
        @click="closeSocialMedia"
      ></i>
    </div>
    <div class="facebook social">
      <img src="https://i.ibb.co/nzdYVs5/facebook.png" alt="facebook" />
      <p>Facebook</p>
    </div>
    <div class="messenger social">
      <span>
        <img src="https://i.ibb.co/2WJ1NhQ/messenger.png" alt="messenger" />
      </span>
      <p>Messenger</p>
    </div>
    <div class="whatsapp social">
      <img src="https://i.ibb.co/vd8g99B/whatsapp.png" alt="whatsapp" />
      <p>Whatsapp</p>
    </div>
    <div class="twitter social">
      <img src="https://i.ibb.co/n88DB2P/twitter.png" alt="twitter" />
      <p>Twitter</p>
    </div>
    <div class="instagram social">
      <img src="https://i.ibb.co/kMfr9F5/instagram.png" alt="instagram" />
      <p>Instagram</p>
    </div>
    <div class="email social">
      <img src="https://i.ibb.co/S3wHVqY/email.png" alt="email" />
      <p>Email</p>
    </div>
    <div class="sms social">
      <img src="https://i.ibb.co/0ZSJWv7/sms.png" alt="sms" />
      <p>SMS</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "SocialMedia",
  data() {
    return {
      isClosed: false,
    };
  },
  methods: {
    closeSocialMedia() {
      this.isClosed = true;
      this.$emit("social-media-closed");
    },
  },
};
</script>

<style scoped>
.social-media-container {
  position: absolute;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-items: center;
  align-content: center;
  gap: 20px;
  transform: translateY(0);
  width: 100%;
  height: 200px;
  padding: 0 25px;
  background-color: rgba(255, 255, 255, 0.9);
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  transition: transform 0.3s ease-in-out;
}
.social-media-container.closed {
  transform: translateY(200px);
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
.open-social-media {
  width: 100%;
  position: absolute;
  transform: translateY(200px);
}
</style>
