<template>
  <div>
    <img
      :src="user.profile"
      class="rounded-circle"
      style="width: 100px"
      alt="Avatar"
    />
    <p class="fw-bold">{{ user.name }}</p>
  </div>
</template>

<script>
export default {
  props : ['user'],
  setup(props){
    
  }
};
</script>

<style></style>
