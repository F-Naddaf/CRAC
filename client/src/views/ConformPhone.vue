<template>
  <div class="card">
    <h1 class="text-lg font-semibold mb-10 mt-3 text-secondary-200">Verification</h1>
    <div class="w-full flex flex-col items-center mb-8">
      <p class="text-xs text-gray-300 mb-3 w-10/12 text-center">
        Enter your phone number preceded by your country code Example: +15017122661
      </p>
      <div class="flex flex-col justify-center items-center w-full relative m-0 p-0 ">
        <input :id="phoneInput.id" :type="phoneInput.type" :pattern="phoneInput.pattern" v-model="phone"
          class="text-sm font-medium p-1 m-3 w-full border border-secondary-100 focus:outline-none peer" ref="input"
          :class="{ 'invalid': invalid }" />
        <label :for="phoneInput.id"
          class="absolute text-sm left-1 top-4 text-gray-400 cursor-text transition-all peer-focus:-top-2 peer-focus:text-primary-200 peer-focus:font-semibold peer-focus:left-1 peer-focus:text-sm"
          :class="{ 'active': inputValue !== '' }">Phone</label>
      </div>
      <button @click="handelPhone" :class="[isPhoneValid ? 'enabledButton' : 'disabledButton']" :disabled="!isPhoneValid">
        Submit
      </button>
    </div>
    <span class="w-full h-px bg-gray-100 mt-2 mb-6"></span>
    <div class="w-full flex flex-col items-center mb-2">
      <p class="text-xs text-gray-300 mb-3 w-10/12 text-center">
        Enter the code you have received via SMS
      </p>
      <div class="flex flex-col justify-center items-center w-full relative m-0 p-0 ">
        <input :id="codeInput.id" :type="codeInput.type" :pattern="codeInput.pattern" v-model="code"
          class="text-sm font-medium p-1 m-3 w-full border border-secondary-100 focus:outline-none peer" ref="input"
          :class="{ 'invalid': invalid }" />
        <label :for="codeInput.id"
          class="absolute text-sm left-1 top-4 text-gray-400 cursor-text transition-all peer-focus:-top-2 peer-focus:text-primary-200 peer-focus:font-semibold peer-focus:left-1 peer-focus:text-sm"
          :class="{ 'active': inputValue !== '' }">Code</label>
      </div>
      <button @click="handelVerify" :class="[isCodeValid ? 'enabledButton' : 'disabledButton']" :disabled="!isCodeValid">
        Verify
      </button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';

export default {
  name: "ConformPhone",
  setup() {
    const invalid = false
    const inputValue = ''
    const phoneInput = {
      id: 'num1',
      name: 'phone',
      type: 'text',
      placeholder: 'Enter your phone number +31 number',
      pattern: '^[0-9]{12}$',
    }
    const codeInput = {
      id: 'num2',
      name: 'code',
      type: 'text',
      placeholder: 'Enter the code you received via SMS ',
      pattern: '^[0-9]{5}$',
    }
    const phone = ref('');
    const code = ref('');

    const handelPhone = async () => {
      try {
        const response = await fetch("http://localhost:5500/api/users/phone", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone: phone.value })
        })
        const json = await response.json()
        localStorage.setItem("serviceId", json.service)
      } catch (error) {
        console.error(error)
      }
    }

    const router = useRouter()
    const handelVerify = async () => {
      const serviceId = localStorage.getItem("serviceId")
      try {
        const response = await fetch("http://localhost:5500/api/users/phone/verify", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: code.value, phone: phone.value, serviceSid: serviceId })
        })
        const json = await response.json()
        if (json.success) {
          localStorage.removeItem("serviceId")
          router.push('/home');
        }
      } catch (error) {
        console.error(error)
      }
    }

    const isPhoneValid = computed(() => phone.value.length === 12);
    const isCodeValid = computed(() => code.value.length === 5);

    return {
      phoneInput,
      inputValue,
      invalid,
      codeInput,
      phone,
      code,
      handelPhone,
      handelVerify,
      isPhoneValid,
      isCodeValid,
    }
  }
}
</script>

<style scoped>
.active {
  top: -0.5rem;
  font-size: 0.88rem;
  font-weight: 600;
  left: 0.25rem;
  color: rgb(243 244 246);
}
</style>