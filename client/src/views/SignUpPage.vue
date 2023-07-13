<template>
  <div
    class="flex flex-col justify-center items-center w-full h-full rounded-md"
  >
    <form @submit.prevent="handelSubmit" class="card">
      <h1 class="mb-5 text-3xl font-bold text-secondary-200">Register</h1>
      <FormInput
        v-for="(input, index) in inputs"
        :key="index"
        :label="input.label"
        :type="input.type"
        :valid="input.valid"
        :error="input.error"
        :pattern="input.pattern"
        v-model="input.value"
        @update:value="input.value = $event"
      />
      <p
        class="text-sm font-semibold"
        style="color: #00cb5a"
        v-if="signUpStatus"
      >
        {{ signUpStatus }}
      </p>
      <p
        class="text-sm font-semibold"
        style="color: rgb(221, 2, 2)"
        v-if="faild"
      >
        {{ faild }}
      </p>
      <button
        type="submit"
        class="LoginButton rounded-lg text-white font-semibold mt-4"
      >
        Submit
      </button>
      <div class="flex w-full ml-5">
        <span class="text-sm mt-4 mb-2 text-gray-300"
          >Already have an account?
          <router-link
            class="pl-2 text-md text-secondary-200 font-semibold"
            to="/login"
            >LogIn</router-link
          >
        </span>
      </div>
    </form>
  </div>
</template>
<script>
import { ref } from "vue";
import FormInput from "../components/FormInput.vue";
import { useRouter } from "vue-router";

export default {
  name: "SignUpPage",

  components: {
    FormInput,
  },

  setup() {
    const inputs = ref({
      username: {
        name: "username",
        type: "text",
        label: "Username",
        pattern: "^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{3,16}",
        value: "",
        error:
          "Username should be 3-16 characters, including an uppercase and number",
      },
      first: {
        name: "first",
        type: "text",
        label: "First Name",
        pattern: "^[a-zA-Z]{3,8}$",
        value: "",
        error: "First name should be 3-8 characters",
      },
      last: {
        name: "last",
        type: "text",
        label: "Last Name",
        pattern: "^[a-zA-Z]{3,8}$",
        value: "",
        error: "Last name should be 3-8 characters",
      },
      email: {
        name: "email",
        type: "email",
        label: "Email address",
        pattern:
          '^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
        value: "",
        error: "invalid Email",
      },
      password: {
        name: "password",
        type: "password",
        label: "Password",
        pattern:
          "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{8,15}$",
        value: "",
        error:
          "Password must be at least 8 characters include 1 number, 1 capital character & 1 special character!",
      },
      confirmPassword: {
        name: "confirmPassword",
        type: "password",
        label: "Confirm Password",
        value: "",
        error: "Password is not match!",
      },
    });

    const router = useRouter();
    const signUpStatus = ref("");
    const faild = ref("");

    const handelSubmit = async () => {
      try {
        const response = await fetch(
          "http://localhost:6500/api/users/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: inputs.value.username.value,
              first: inputs.value.first.value,
              last: inputs.value.last.value,
              email: inputs.value.email.value,
              password: inputs.value.password.value,
              confirmPassword: inputs.value.confirmPassword.value,
            }),
          }
        );
        const result = await response.json();
        faild.value = result.message;
        if (result.success) {
          setTimeout(() => {
            router.push("/login");
          }, 3000);
          signUpStatus.value = "You have created an account successfully";
        } else {
          faild.value = result.message;
        }
      } catch (error) {
        faild.push("Sorry something went wrong");
      }
    };

    return {
      inputs,
      router,
      faild,
      signUpStatus,
      handelSubmit,
    };
  },
};
</script>
