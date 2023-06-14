<template>
  <div class="relative w-full h-full flex items-center justify-center">
    <i class="fa-solid fa-circle-xmark" @click="goBack"></i>
    <form class="card" @submit.prevent="handelSubmit">
      <h1 class="mb-10 text-2xl font-semibold text-secondary-200">
        Edit Profile
      </h1>
      <FormInput
        v-for="(user, index) in userData"
        :key="index"
        :label="user.label"
        :type="user.type"
        :existingValue="user.detail"
        :error="user.error"
        :pattern="user.pattern"
        v-model="user.value"
        @update:value="user.value = $event"
      />
      <CroppedImage
        @image-cropped="isCropped = true"
        @image-cropped-url="imageUrl = $event"
        v-bind:id="id"
      />
      <p class="text-green text-sm font-semibold">{{ resultMessage }}</p>
      <div class="flex flex-col items-center w-5/6 mb-2 mt-4">
        <button
          class="flex items-center justify-center w-full py-1 text-md font-semibold text-gray-700 rounded-md"
          @click="handleCrop"
          :class="isCropped ? 'enabled' : 'disabled'"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, inject, onMounted } from "vue";
import FormInput from "../components/FormInput.vue";
import { useRouter } from "vue-router";
import CroppedImage from "../components/edit-profile/CroppedImage.vue";

export default {
  name: "EditProfile",
  components: {
    FormInput,
    CroppedImage,
  },
  setup() {
    const store = inject("store");
    const id = ref("");
    const image = ref(null);
    const isCropped = ref(false);
    const imageUrl = ref("");
    const resultMessage = ref("");

    const userData = ref({
      username: {
        label: "Username",
        detail: "",
        type: "text",
        value: "",
        pattern: "^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{3,16}",
        error:
          "Username should be 3-16 characters, including an uppercase and number",
      },
      first: {
        label: "First Name",
        detail: "",
        type: "text",
        value: "",
        pattern: "^[a-zA-Z]{3,8}$",
        error: "First name should be 3-8 characters",
      },
      last: {
        label: "Last Name",
        detail: "",
        type: "text",
        value: "",
        pattern: "^[a-zA-Z]{3,8}$",
        error: "Last name should be 3-8 characters",
      },
    });

    const router = useRouter();

    onMounted(async () => {
      await store.methods.load();
      id.value = store.state.userData?._id;
      userData.value.first.detail = store.state.userData?.firstname;
      userData.value.last.detail = store.state.userData?.lastname;
      userData.value.username.detail = store.state.userData?.username;
    });

    const handelSubmit = async () => {
      try {
        const response = await fetch(
          `http://localhost:6500/api/users/${id.value}/updateUser`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: id.value,
              username: userData.value.username.value,
              first: userData.value.first.value,
              last: userData.value.last.value,
              userImage: imageUrl.value,
            }),
          }
        );
        const result = await response.json();
        resultMessage.value = result.message;
        setTimeout(() => {
          router.push(`/profile/${id.value}`);
        }, 3000);
      } catch (error) {
        console.log(error);
      }
    };

    const goBack = async () => {
      router.push(`/profile/${id.value}`);
    };

    return {
      store,
      id,
      image,
      userData,
      imageUrl,
      resultMessage,
      isCropped,
      handelSubmit,
      goBack,
    };
  },
};
</script>

<style scoped>
.fa-circle-xmark {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #51555e;
  font-size: 20px;
  z-index: 10;
}
.fa-circle-xmark:hover {
  cursor: pointer;
  color: #E67CB1;
}
.disabled {
  background-color: rgb(167, 167, 167);
  width: 100%;
  cursor: auto;
}
.enabled {
  background-color: #167199;
  width: 100%;
  cursor: pointer;
  color: #d1d5db;
}
</style>
