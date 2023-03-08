<template>
  <input :placeholder="placeholder" required class="placeholder" />
  <p v-if="error" class="validationMessage">{{ error }}</p>
</template>

<script>
export default {
name: "FormInput",
props: ["placeholder", "error"]
}
</script>
