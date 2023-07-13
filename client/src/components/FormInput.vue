<template>
  <div
    class="flex flex-col justify-center items-center w-full relative m-0 p-0"
  >
    <p
      v-if="existingValue"
      class="absolute text-sm right-1 -top-2 text-primary-200"
    >
      {{ existingValue }}
    </p>
    <input
      :id="label"
      :type="!inputType ? type === 'password' : type"
      required
      @blur="validate"
      @input="inputValue = $event.target.value"
      class="text-sm font-medium p-1 m-3 w-full border border-secondary-100 focus:outline-none peer"
      :class="{ invalid: invalid }"
      ref="input"
    />

    <label
      :for="label"
      class="absolute text-sm left-1 top-4 text-gray-400 cursor-text transition-all peer-focus:-top-2 peer-focus:text-primary-200 peer-focus:left-1 peer-focus:text-sm"
      :class="{ active: inputValue !== '' }"
    >
      {{ label }}
    </label>

    <i
      v-if="type === 'password'"
      :class="['fa-regular', showPassword ? 'fa-eye' : 'fa-eye-slash']"
      @click="showPassword = !showPassword"
    ></i>
    <p v-if="touched && invalid" class="validationMessage">{{ error }}</p>
  </div>
</template>

<script>
import { ref, watch, computed } from "vue";

export default {
  name: "FormInput",
  props: {
    label: String,
    error: String,
    pattern: String,
    type: String,
    valid: {
      type: Boolean,
      default: null,
    },
    value: {
      type: String,
      default: "",
    },
    existingValue: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const invalid = ref(false);
    const touched = ref(false);
    const inputValue = ref("");
    const showPassword = ref(false);

    const inputType = computed(() => {
      if (props.type === "password" && showPassword.value) {
        return props.type === "text";
      } else {
        return props.type;
      }
    });

    const validate = () => {
      const regex = new RegExp(props.pattern);
      touched.value = true;

      if (!regex.test(inputValue.value)) {
        invalid.value = true;
      } else {
        invalid.value = false;
      }

      emit("update:value", inputValue.value);

      if (props.name === "confirmPassword") {
        const passwordInput = inputs.password;
        if (
          inputValue.value === passwordInput.value ||
          passwordInput.value === ""
        ) {
          invalid.value = false;
        } else {
          invalid.value = true;
        }
      }
    };

    watch(inputValue, (newValue) => {
      emit("update:value", newValue);
    });

    return {
      invalid,
      touched,
      inputValue,
      showPassword,
      inputType,
      validate,
    };
  },
};
</script>

<style scoped>
.active {
  top: -0.5rem;
  font-size: 0.88rem;
  left: 0.25rem;
  color: rgb(243 244 246);
}
.fa-regular {
  position: absolute;
  top: 20px;
  right: 10px;
  color: rgb(133, 133, 133);
  z-index: 10;
  font-size: 14px;
  cursor: pointer;
}
</style>
