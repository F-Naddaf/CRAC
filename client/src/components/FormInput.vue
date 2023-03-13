<template>
  <div class="flex flex-col justify-center items-center w-full relative m-0 p-0 ">
    <input
    :id="label"
    :type="type"
    required
    @blur="validate"
    @input="inputValue = $event.target.value"
    class="text-sm font-medium p-1 m-3 w-full border border-secondary-100 focus:outline-none peer"
    :class="{'invalid': invalid}"
    ref="input" />
    <label :for="label"
    class="absolute text-sm left-2 top-4 text-gray-400 cursor-text transition-all peer-focus:-top-2 peer-focus:text-gray-100 peer-focus:font-semibold peer-focus:left-0 peer-focus:text-sm"
    :class="{'active': inputValue !== ''}">
    {{ label }}</label>  
    <p v-if="touched && invalid" class="validationMessage">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: "FormInput",
  props: {
    label: String,
    error: String,
    pattern: String,
    type: String,
    valid: {
      type: Boolean,
      default: null
    },
    value: {
    type: String,
    default: ''
    }
  },
  data() {
    return {
      invalid: false,
      touched: false,
      inputValue: '',
    }
  },
  emits: ['update:value'],
  methods: {
    validate() {
      const regex = new RegExp(this.pattern);
      this.touched = true;
      if (!regex.test(this.inputValue)) {
        this.invalid = true;
      } else {
        this.invalid = false;
      }
      this.$emit('update:value', this.inputValue);
    }
  }
};
</script>

<style scoped>
.active {
  top: -0.5rem;
  font-size: 0.88rem;
  font-weight: 600;
  left: 0;
  color: rgb(243 244 246);
}
</style>