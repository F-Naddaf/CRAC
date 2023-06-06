<template>
  <form class="card">
    <h1 class="mb-10 text-2xl font-semibold text-secondary-200">
      Edit Profile
    </h1>
    <FormInput
      v-for="user in userData"
      :key="user.id"
      :label="user.label"
      :existingValue="user.detail"
      :pattern="user.pattern"
      :error="user.error"
    />
  </form>
</template>

<script>
import { ref, inject, onMounted } from "vue";
import FormInput from "../components/FormInput.vue";

export default {
  name: "EditProfile",
  components: {
    FormInput,
  },
  setup() {
    const store = inject("store");
    const id = ref("");
    const image = ref("");

    const userData = ref({
      username: {
        label: "Username",
        detail: "",
        pattern: "^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{3,16}",
        error:
          "Username should be 3-16 characters, including an uppercase and number",
      },
      first: {
        label: "First Name",
        detail: "",
        pattern: "^[a-zA-Z]{3,8}$",
        error: "First name should be 3-8 characters",
      },
      last: {
        label: "Last Name",
        detail: "",
        pattern: "^[a-zA-Z]{3,8}$",
        error: "Last name should be 3-8 characters",
      },
    });

    onMounted(async () => {
      await store.methods.load();
      id.value = store.state.userData?._id;
      image.value = store.state.userData?.userImage;
      userData.value.first.detail = store.state.userData?.firstname;
      userData.value.last.detail = store.state.userData?.lastname;
      userData.value.username.detail = store.state.userData?.username;
    });

    return {
      store,
      id,
      userData,
    };
  },
};
</script>

<style></style>
