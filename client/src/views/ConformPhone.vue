<template>
  <div class="card">
    <h1 class="text-lg font-semibold mb-6 mt-3 text-secondary-200">Conform your phone number</h1>
    <input class="verifyPhoneInput m-2" :type="phoneInput.type" :placeholder="phoneInput.placeholder" :pattern="phoneInput.pattern" v-model="phone" />
    <button :class="[isPhoneValid ? 'enabledButton' : 'disabledButton']"
    :disabled="!isPhoneValid">
    Submit
    </button>
    <h1 class="text-lg font-semibold mt-10 mb-6 text-secondary-200">Verify the code</h1>
    <input class="verifyPhoneInput mb-2" :type="codeInput.type" :placeholder="codeInput.placeholder" :pattern="codeInput.pattern" v-model="code" />
    <button :class="[isCodeValid ? 'enabledButton' : 'disabledButton']"
    :disabled="!isCodeValid">
    Verify
    </button>
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
      placeholder: 'Enter your phone number',
      pattern: '^[0-9]{9}$',
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
      phone: ''
    }
  },
  computed: {
    isPhoneValid() {
      return this.phone.length === 9;
    }
  },
}
</script>
