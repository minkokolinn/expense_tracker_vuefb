<template>
  <div class="container vh-100 pt-5">
    <h1 class="text-center mb-4">Current Member</h1>
    <div class="row mx-auto col-12 col-sm-10 col-md-6">
      <div v-for="user in users" :key="user.id" class="col-6 col-lg-4 text-center">
        <router-link :to="{name:'DashboardView',params:{userId:user.id}}">
          <ProfileBadgeHome :user="user"></ProfileBadgeHome>
        </router-link>
      </div>
    </div>
    <NewMemberComponent></NewMemberComponent>
    <div v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import ProfileBadgeHome from "../components/ProfileBadgeHome";
import NewMemberComponent from "../components/NewMemberComponent";
import getUsers from "@/composables/getUsers";
export default {
  name: "HomeView",
  components: {
    ProfileBadgeHome,
    NewMemberComponent,
  },
  setup() {
    let { users, error, load } = getUsers();
    load();
    return {
      users,
      error,
    };
  },
};
</script>
