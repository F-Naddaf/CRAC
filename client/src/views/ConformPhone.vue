<template>
  <div class="card">
    <h1 class="text-lg font-semibold mb-10 mt-3 text-secondary-200">Verification</h1>
    <div class="w-full flex flex-col items-center mb-8">
      <label class="text-sm text-gray-200 self-start">Phone</label>
      <input class="verifyPhoneInput mb-2" :type="phoneInput.type" :placeholder="phoneInput.placeholder" :pattern="phoneInput.pattern" v-model="phone" />
      <button :class="[isPhoneValid ? 'enabledButton' : 'disabledButton']"
      :disabled="!isPhoneValid">
      Submit
    </button>
    </div>
    <div class="w-full flex flex-col items-center mb-2">
      <label class="text-sm text-gray-200 self-start">Code</label>
      <input class="verifyPhoneInput mb-2" :type="codeInput.type" :placeholder="codeInput.placeholder" :pattern="codeInput.pattern" v-model="code" />
      <button :class="[isCodeValid ? 'enabledButton' : 'disabledButton']"
      :disabled="!isCodeValid">
      Verify
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConformPhone",
  data() {
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
    return {
      phoneInput,
      codeInput,
      phone: '',
      code: ''
    }
  },
  computed: {
    isPhoneValid() {
      return this.phone.length === 12;
    },
    isCodeValid() {
      return this.phone.length === 6;
    }
  },
}
</script>
