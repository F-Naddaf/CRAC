<template>
  <div class="flex flex-col justify-center items-center w-full relative m-0 p-0 ">
    <input
    :id="label"
    :type="type"
    required
    @blur="validate"
    class="text-sm font-medium p-1 m-3 w-full border border-secondary-100 focus:outline-none peer"
    :class="{'invalid': invalid}"
    ref="input" />
    <label :for=label class="absolute text-md left-2 top-3.5 text-gray-400 cursor-text transition-all peer-focus:-top-2.5 peer-focus:text-gray-100 peer-focus:font-semibold peer-focus:left-0 peer-focus:text-sm">{{ label }}</label>
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
    }
  },
  emits: ['input'],
  methods: {
    validate() {
      const regex = new RegExp(this.pattern);
      this.touched = true;
      if (!regex.test(this.$refs.input.value)) {
        this.invalid = true;
      } else {
        this.invalid = false;
      }
    },
    emitInput(event) {
      this.$emit('input', event.target.value);
    }
  },
}
</script>