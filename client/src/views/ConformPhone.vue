<template>
  <div class="card">
    <h1 class="text-lg font-semibold mb-10 mt-3 text-secondary-200">Conform your phone number</h1>
    <FormInput :key="input.id" :type="input.type" :placeholder="input.placeholder" />
    <button class="LoginButton rounded-lg text-white font-semibold mt-4">Submit </button>
  </div>
</template>

<script>
import FormInput from "../components/FormInput.vue"
export default {
name: "ConformPhone",
data() {
    const input = {
      id: 'num1',
      name: 'phone',
      type: 'number',
      placeholder: 'Add your phone number',
    }
    return {
      input
    }
  },
  components: {
    FormInput
  }
}
</script>
