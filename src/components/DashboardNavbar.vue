<template>
  <div class="flex-row d-flex justify-content-between align-items-center">
    <div class="ms-2 ms-lg-5">
      <h4 class="text-center mb-3">
        <router-link to="/" class="backbtn" @click.prevent="handleBack">
          <i class="fas fa-long-arrow-alt-left" style="font-size: 26px;"></i>
        </router-link>
        Dashboard
      </h4>
    </div>
    <router-link v-if="authuser" :to="{name:'ProfleView',params:{userId:user.id}}" style="text-decoration: none">
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
    <div v-else
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
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { auth, signOut } from "@/firebase/config";

export default {
  props:['user','authuser'],
  setup(props){
    let user = props.user;
    let authuser = props.authuser;
    let router = useRouter();
    let handleBack = async()=>{
      if(authuser && user.id==authuser.uid){
        if(confirm("Are you sure to logout?")){
          await signOut(auth);
          router.push({name:"HomeView"});
        }
      }else{
        router.push("/");
      }
    }
    
    return {handleBack}
  }
};
</script>

<style></style>
