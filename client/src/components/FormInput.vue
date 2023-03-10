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
  // props: ["placeholder", "error", "pattern", "type"],
  data() {
    return {
      invalid: false,
      touched: false,
    }
  },
  methods: {
    validate() {
      console.log("ref before",this.$refs.input)
      const regex = new RegExp(this.pattern);
      this.touched = true;
      if (!regex.test(this.$refs.input.value)) {
        this.invalid = true;
      } else {
        this.invalid = false;
      }
      console.log("ref after",this.$refs.input)
    },
  },
}
</script>
