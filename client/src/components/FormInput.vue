<template>
  <input :placeholder="placeholder" required class="placeholder"/>
</template>

<script>
export default {
name: "FormInput",
props: ["placeholder"]
}
</script>
