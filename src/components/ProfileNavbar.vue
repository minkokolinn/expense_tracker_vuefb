<template>
  <div class="flex-row d-flex justify-content-between align-items-center">
    <div class="ms-2 ms-lg-5">
      <h1 class="text-center mb-3" style="font-size: 26px">
        <router-link :to="{name:'DashboardView',params:{userId:user.id}}" class="backbtn">
          <i class="fas fa-long-arrow-alt-left"></i>
        </router-link>
        Profile
      </h1>
    </div>
  </div>
</template>

<script>
export default {
  props:['user']
};
</script>

<style></style>
