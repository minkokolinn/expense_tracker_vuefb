<template>
  <div class="row mx-auto justify-content-center">
    <div class="col-12 col-sm-10 col-md-6 mt-5">
      <h1 class="text-center mb-4">New Member</h1>
      <div class="form-floating p-0 mt-2">
        <input
          type="email"
          class="form-control ps-4"
          id="floatingInput"
          placeholder="name@example.com"
        />
        <label for="floatingInput" class="ps-4">Enter Name</label>
      </div>
      <div class="d-flex justify-content-end">
        <button type="button" class="btn btn-outline-dark w-25 mt-3">
          Create
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import createDocument from "@/composables/createDocument"
import { ref } from 'vue';
export default {
  setup(){
    let {error, addDocument} = createDocument("users");
    
    let name = ref("")
  }
};
</script>

<style></style>
