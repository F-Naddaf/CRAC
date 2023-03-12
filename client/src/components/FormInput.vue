<template>
    <input :placeholder="placeholder"
          :type="type"
           required
           @blur="validate"
           class="placeholder"
           :class="{'invalid': invalid}"
           ref="input" />
    <p v-if="touched && invalid" class="validationMessage">{{ error }}</p>
</template>

<script>
export default {
  name: "FormInput",
  props: {
    placeholder: String,
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
