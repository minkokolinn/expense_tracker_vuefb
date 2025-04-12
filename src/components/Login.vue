<template>
  <div class="row mx-auto justify-content-center">
    <div class="col-12 col-sm-10 col-md-6 mt-5">
      <h1 class="text-center mb-4">Login</h1>
      <p class="text-danger" v-if="error">{{ error }}</p>
      <form @submit.prevent="handleLogin">
        <div class="form-floating p-0 mt-2">
          <input
            type="email"
            class="form-control ps-4"
            id="email"
            placeholder="Enter Email"
            v-model="email"
            required
          />
          <label for="floatingInput" class="ps-4">Enter Email</label>
        </div>
        <div class="form-floating p-0 mt-2">
          <input
            type="password"
            class="form-control ps-4"
            id="password"
            placeholder="Enter Password"
            v-model="password"
            required
            minlength="6"
          />
          <label for="floatingInput" class="ps-4">Enter Password</label>
        </div>
        <div class="d-flex justify-content-end">
          <button type="submit" class="btn btn-outline-dark w-25 mt-3">
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import createDocument from "@/composables/createDocument";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth, signInWithEmailAndPassword } from "@/firebase/config";
export default {
  setup() {
    let { error, addDocument, newDocId } = createDocument("users");
    let email = ref(null);
    let password = ref(null);

    let router = useRouter();

    // creating user process
    let handleLogin = async () => {
      try {
        const { user } = await signInWithEmailAndPassword(auth, email.value, password.value);
        const userId = user.uid;
        router.push({
          name: "DashboardView",
          params: { userId: userId },
        });
      } catch (err) {
        error.value = err.message;
      }
    };

    return { email, password, error, handleLogin };
  },
};
</script>

<style></style>
