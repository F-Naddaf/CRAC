<template>
  <div
    class="flex flex-col justify-center items-center w-full h-full rounded-md"
  >
    <form class="card">
      <h1 class="mb-5 text-3xl font-bold text-secondary-200">Login</h1>
      <FormInput
        v-for="input in inputs"
        :key="input.id"
        :label="input.label"
        :type="input.type"
        :valid="input.valid"
        :error="input.error"
        :pattern="input.pattern"
        v-model="input.value"
      />
      <p class="text-sm font-bold text-primary-200" v-if="loginStatus">
        {{ loginStatus }}
      </p>
      <button
        @click="handleLogIn"
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
    const inputs = [
      {
        id: 1,
        name: "username",
        type: "email",
        label: "Email address",
        pattern: "^\\S+@\\S+\\.\\S+$",
        value: "",
        valid: null,
        error: "Incorrect Email address",
      },
      {
        id: 2,
        name: "password",
        type: "password",
        label: "Password",
        pattern:
          "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{8,15}$",
        value: "",
        valid: null,
        error: "Incorrect Password",
      },
    ];

    const Vue3GoogleOauth = inject("Vue3GoogleOauth");
    const userEmail = ref("");
    const password = ref("");
    const userFirstName = ref("");
    const userLastName = ref("");
    const userName = ref("");
    const loginStatus = ref("");

    const inputError = (input) => {
      if (!input.type) {
        return input.error;
      } else {
        return "";
      }
    };

    const handleLogIn = async () => {
      console.log("handleLogIn called");
      try {
        const response = await fetch(`http://localhost:6500/api/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail.value,
            password: password.value,
          }),
        });
        const result = await response.json();
        console.log("result", result);
        loginStatus.value = result.message;
        if (result.success) {
          setTimeout(() => {
            router.push("/phone");
          }, 3000);
        } else {
          return result.message;
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handelSignInWithGoogle = async () => {
      try {
        gapi.load("auth2", async () => {
          const googleAuth = gapi.auth2.getAuthInstance();
          const googleUser = await googleAuth.signIn();
          if (!googleUser) {
            return null;
          } else {
            userEmail.value = googleUser.getBasicProfile().getEmail();
            userFirstName.value = googleUser.wt.rV;
            userLastName.value = googleUser.wt.uT;

            userName.value = `${userFirstName.value.charAt(0)}${
              userLastName.value
            }`;
            setTimeout(() => {
              router.push("/phone");
            }, 3000);
            console.log("google user", googleUser);
          }
          const response = await fetch(
            `http://localhost:6500/api/users/login/google`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: userName.value,
                first: userFirstName.value,
                last: userLastName.value,
                email: userEmail.value,
              }),
            }
          );
          const result = await response.json();
          loginStatus.value = result.message;
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
      userEmail,
      password,
      userFirstName,
      userLastName,
      userName,
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
