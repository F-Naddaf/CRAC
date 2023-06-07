<template>
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
    <CroppedImage @image-cropped="isCropped = true" />
    <div class="w-5/6 mb-2 mt-4">
      <button
        class="flex items-center justify-center w-full py-1 text-md font-semibold text-gray-700 rounded-md"
        @click="handleCrop"
        :class="isCropped ? 'enabled' : 'disabled'"
      >
        Submit
      </button>
    </div>
  </form>
</template>

<script>
import { ref, inject, onMounted } from "vue";
import FormInput from "../components/FormInput.vue";
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

    onMounted(async () => {
      await store.methods.load();
      id.value = store.state.userData?._id;
      userData.value.first.detail = store.state.userData?.firstname;
      userData.value.last.detail = store.state.userData?.lastname;
      userData.value.username.detail = store.state.userData?.username;
      console.log("isCropped", isCropped);
    });

    const handelSubmit = async () => {
      console.log("value", userData.value.username.value);
      console.log("value", id.value);
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
              //   userImage: croppedImage.value,
            }),
          }
        );
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    };

    return {
      store,
      id,
      image,
      userData,
      isCropped,
      handelSubmit,
    };
  },
};
</script>

<style scoped>
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
