<template>
  <div class="flex flex-col justify-center items-center w-full h-full rounded-md">
    <form class="card">
      <h1 class="mb-5 text-3xl font-bold text-secondary-200">Register</h1>
      <FormInput v-for="input in inputs" :key="input.id" :label="input.label" :type="input.type" :valid="input.valid"
        :error="input.error" :pattern="input.pattern" :value="input.value" @input="input.value = $event.target.value" />
      <button type="submit" class="LoginButton rounded-lg text-white font-semibold mt-4">Submit</button>
      <div class="flex w-full ml-5">
        <span class="text-sm mt-4 mb-2 text-gray-300">Already have an account?
          <router-link class="pl-2 text-md text-secondary-200 font-semibold" to="/login">LogIn</router-link>
        </span>
      </div>
    </form>
  </div>
</template>
<script>
import FormInput from "../components/FormInput.vue"

export default {
  name: "SignUpPage",
  data() {
    const inputs = [{
      id: 101,
      name: 'username',
      type: 'text',
      label: 'Username',
      pattern: "^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{3,16}",
      value: '',
      valid: null,
      error: "Username should be 3-16 characters, including an uppercase and number"
    },
    {
      id: 102,
      name: 'first',
      type: 'text',
      label: 'First Name',
      pattern: "^[a-zA-Z]{3,8}$",
      value: '',
      valid: null,
      error: "First name should be 3-8 characters"
    },
    {
      id: 103,
      name: 'last',
      type: 'text',
      label: 'Last Name',
      pattern: "^[a-zA-Z]{3,8}$",
      value: '',
      valid: null,
      error: "Last name should be 3-8 characters"
    },
    {
      id: 104,
      name: 'email',
      type: 'email',
      label: 'Email address',
      pattern: "^(([^<>()[\\]\\\\.,;:\\s@\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\"]+)*)|(\\\".+\\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$",
      value: '',
      valid: null,
      error: "invalid Email"
    },
    {
      id: 105,
      name: 'password',
      type: 'password',
      label: 'Password',
      pattern: "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{8,15}$",
      value: '',
      valid: null,
      error: "Password must be at least 8 characters include 1 number, 1 capital character & 1 special character!"
    },
    {
      id: 106,
      name: 'confirmPassword',
      type: 'password',
      label: 'Confirm Password',
      value: '',
      valid: null,
      error: "Password is not match!",
      validate() {
        const passwordInput = this.$root.inputs.find(input => input.name === 'password')
        if (this.value === passwordInput.value) {
          this.valid = true
          this.error = null
        } else {
          this.valid = false
          this.error = "Password does not match!"
        }
      }
    }]
    return {
      inputs,
      isLoading: false,
    }
  },
  components: {
    FormInput
  }
}
</script>
