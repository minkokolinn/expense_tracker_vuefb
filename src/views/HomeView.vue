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
    
    <div v-if="loginFlag">
      <Login></Login>
      <p class="text-center mt-3" style="cursor: pointer;" @click="loginFlag=false"><u>I don't have an account! Let me create a new one</u></p>
    </div>
    <div v-else>
      <Register></Register>
      <p class="text-center mt-3" style="cursor: pointer;" @click="loginFlag=true"><u>Already have an account!</u></p>
    </div>
    
    <div v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import Login from '../components/Login'
import Register from '../components/Register'
import ProfileBadgeHome from "../components/ProfileBadgeHome";
import getUsers from "@/composables/getUsers";
import { ref } from 'vue';
export default {
  name: "HomeView",
  components: {
    Login,
    Register,
    ProfileBadgeHome,
  },
  setup() {
    let { users, error, load } = getUsers();
    load();

    let loginFlag = ref(true);
    
    return {
      users,
      error,
      loginFlag
    };
  },
};
</script>
