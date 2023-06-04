<template>
  <div
    class="flex flex-col justify-center items-center w-full h-full rounded-md"
  >
    <form @submit.prevent="handleLogIn" class="card">
      <h1 class="mb-5 text-3xl font-bold text-secondary-200">Login</h1>
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
      <p class="text-sm font-bold text-primary-200" v-if="loginStatus">
        {{ loginStatus }}
      </p>
      <button
        type="submit"
        class="LoginButton rounded-lg text-white font-semibold mt-4"
      >
        Login
      </button>
      <div class="flex w-full ml-5">
        <span class="text-sm mt-4 text-gray-300"
          >Don't have an account?
          <router-link
            class="pl-2 text-md text-secondary-200 font-semibold"
            to="/register"
            >Register</router-link
          >
        </span>
      </div>
      <div class="flex items-center justify-between w-full mt-5">
        <span class="w-1/2 h-0.5 bg-gray-300"></span>
        <p class="font-bold p-3 text-gray-300">OR</p>
        <span class="w-1/2 h-0.5 bg-gray-300"></span>
      </div>
      <button @click="handelSignInWithGoogle" class="googleButton mt-3 mb-2">
        <img
          src="../../public/img/google.png"
          alt="Google logo"
          class="h-full p-1.5"
        />
        <span class="pl-4 text-sm font-semibold">Login with google</span>
      </button>
    </form>
  </div>
</template>

<script>
import FormInput from "../components/FormInput.vue";
import { gapi } from "gapi-script";
import router from "../router";
import { inject, ref } from "vue";
export default {
  name: "LoginPage",

  components: {
    FormInput,
  },

  setup() {
    const inputs = ref({
      username: {
        name: "username",
        type: "email",
        label: "Email address",
        pattern: "^\\S+@\\S+\\.\\S+$",
        value: "",
        valid: null,
        error: "Incorrect Email address",
      },
      password: {
        name: "password",
        type: "password",
        label: "Password",
        pattern:
          "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{8,15}$",
        value: "",
        valid: null,
        error: "Incorrect Password",
      },
    });

    const Vue3GoogleOauth = inject("Vue3GoogleOauth");
    const loginStatus = ref("");
    const inputError = (input) => {
      if (!input.type) {
        return input.error;
      } else {
        return "";
      }
    };

    const handleLogIn = async () => {
      try {
        const response = await fetch(`http://localhost:6500/api/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: inputs.value.username.value,
            password: inputs.value.password.value,
          }),
        });
        const result = await response.json();
        if (result.success) {
          localStorage.setItem("accessToken", result.accessToken);
          loginStatus.value = result.message;
          setTimeout(() => {
            router.push("/phone");
          }, 3000);
        } else {
          loginStatus.value = result.message;
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handelSignInWithGoogle = async () => {
      try {
        inputs.value.username.error = "";
        inputs.value.password.error = "";
        gapi.load("auth2", async () => {
          const googleAuth = gapi.auth2.getAuthInstance();
          const googleUser = await googleAuth.signIn();
          if (!googleUser) {
            return null;
          } else {
            const userEmail = googleUser.getBasicProfile().getEmail();
            const userFirstName = googleUser.wt.rV;
            const userLastName = googleUser.wt.uT;
            const userName = `${userFirstName.charAt(0)}${userLastName}`;

            const response = await fetch(
              `http://localhost:6500/api/users/login/google`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: userName,
                  first: userFirstName,
                  last: userLastName,
                  email: userEmail,
                }),
              }
            );
            const result = await response.json();
            if (result.success) {
              setTimeout(() => {
                router.push("/phone");
              }, 3000);
            }
            loginStatus.value = result.message;
          }
        });
      } catch (error) {
        console.log(error);
      }
    };

    return {
      inputs,
      isLoading: false,
      inputError,
      handleLogIn,
      handelSignInWithGoogle,
      loginStatus,
    };
  },
};
</script>

<style>
.g-signin2 {
  width: 100%;
  position: relative !important;
}

.g-signin2 div {
  width: 100% !important;
}

.g-signin2 span {
  margin-left: -50%;
}
</style>
