<template>
  <div class="flex-row d-flex justify-content-between align-items-center">
    <div class="ms-2 ms-lg-5">
      <h1 class="text-center mb-3" style="font-size: 26px">
        <router-link to="/" class="backbtn">
          <i class="fas fa-long-arrow-alt-left"></i>
        </router-link>
        Dashboard
      </h1>
    </div>
    <router-link :to="{name:'ProfleView',params:{userId:user.id}}" style="text-decoration: none">
      <div
        class="d-flex align-items-center me-2 me-lg-5 pb-2"
        style="border-bottom: 3px solid gray"
      >
        <img
          :src="user.profile"
          class="rounded-circle"
          style="width: 40px"
          alt="Avatar"
        />
        <p class="fw-bold mb-0 ms-2" style="font-size: 14px">
          {{ user.name }}
        </p>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props:['user']
};
</script>

<style></style>
