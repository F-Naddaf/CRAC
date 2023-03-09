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
  props: ["placeholder", "error", "pattern", "type"],
  data() {
    return {
      invalid: false,
      touched: false,
    }
  },
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
  },
}
</script>
