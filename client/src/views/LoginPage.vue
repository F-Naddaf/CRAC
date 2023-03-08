<template>
  <div class="flex flex-col justify-center items-center w-full h-full rounded-md">
    <form class="authForm">
      <h1 class="mb-5 text-3xl font-bold text-gray-200">Login</h1>
      <FormInput v-for="input in inputs" :key="input.id" :placeholder="input.placeholder"/>
      <button class="secondaryLink rounded-lg text-white font-semibold mt-4">Login</button>
      <span class="text-sm mt-3 text-gray-300">Don't have an account?
        <router-link class="pl-2 text-md text-secondary-100 font-semibold" to="/">SignUp</router-link>
      </span>
      <div class="flex items-center justify-between w-full mt-5">
        <span class="w-1/2 h-0.5 bg-gray-300"></span>
        <p class="font-bold p-3 text-gray-300">OR</p>
        <span class="w-1/2 h-0.5 bg-gray-300"></span>
      </div>
      <h1>initialized: {{ Vue3GoogleOauth.isInit }}</h1>
      <button @click="handelSignIn">Sign in with google</button>
    </form>
  </div>
</template>

<script>
import FormInput from "../components/FormInput.vue"
import { gapi } from 'gapi-script';
import router from '../router'
import { inject } from 'vue'
export default {
name: "LoginPage",
  data() {
    const inputs = [{
      id: 1,
      name: 'username',
      type: 'text',
      placeholder: 'Username'
    },
    {
      id: 2,
      name: 'password',
      type: 'text',
      placeholder: 'Password'
    }]
    return {
      inputs,
      isLoading: false,
    }
  },
  setup() {
    const Vue3GoogleOauth = inject('Vue3GoogleOauth');
    return {
      Vue3GoogleOauth,
      user: ''
    }
  },
  methods: {
    async handelSignIn() {
      try {
        gapi.load('auth2', async () => {
          const googleAuth = gapi.auth2.getAuthInstance();
          const googleUser = await googleAuth.signIn();
          if(!googleUser) {
            return null
          } else {
            this.user = googleUser.getBasicProfile().getEmail()
            router.push('/');
            console.log("google user", googleUser);
          }
        });
      } catch (error) {
        console.log(error)
      }
    }
  },
  components: {
    FormInput
  }
}
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