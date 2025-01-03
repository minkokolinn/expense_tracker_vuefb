<template>
  <div class="spinner"></div>
</template>

<script>
export default {};
</script>

<style scoped>
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid transparent;
  border-radius: 50%;
  margin: 30px auto;
  border-top-color: red;
  animation: spin 1s infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
