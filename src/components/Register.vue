<template>
  <div class="row mx-auto justify-content-center">
    <div class="col-12 col-sm-10 col-md-6 mt-5">
      <h1 class="text-center mb-4">Register a new member</h1>
      <p class="text-danger" v-if="error">{{ error }}</p>
      <form @submit.prevent="handleCreate">
        <div class="form-floating p-0 mt-2">
          <input
            type="text"
            class="form-control ps-4"
            id="nametb"
            placeholder="Enter Name"
            v-model="name"
            required
          />
          <label for="nametb" class="ps-4">Enter Name</label>
        </div>
        <div class="form-floating p-0 mt-2">
          <input
            type="email"
            class="form-control ps-4"
            id="emailtb"
            placeholder="Enter Email"
            v-model="email"
            required
          />
          <label for="emailtb" class="ps-4">Enter Email</label>
        </div>
        <div class="form-floating p-0 mt-2">
          <input
            type="password"
            class="form-control ps-4"
            id="passwordtb"
            placeholder="Enter Password"
            v-model="password"
            minlength="6"
            required
          />
          <label for="passwordtb" class="ps-4">Enter Password</label>
        </div>
        <div class="form-floating p-0 mt-2">
          <input
            type="password"
            class="form-control ps-4"
            id="cpasswordtb"
            placeholder="Enter Confirm Password"
            v-model="cpassword"
            minlength="6"
            required
          />
          <label for="cpasswordtb" class="ps-4">Enter Confirm Password</label>
        </div>
        <div class="form-floating p-0 mt-2">
          <select
            class="form-select"
            id="currencycb"
            v-model="currency"
            aria-label="Floating label select example"
            required
          >
            <option value="" selected>
              Choose currency type to use in this account
            </option>
            <option value="MMK">MMK</option>
            <option value="THB">THB</option>
            <option value="USD">USD</option>
          </select>
          <label for="currencycb">Curreny</label>
        </div>
        <div class="d-flex justify-content-end">
          <button type="submit" class="btn btn-outline-dark w-25 mt-3">
            Create
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
import { createUserWithEmailAndPassword, auth, db } from "@/firebase/config";
import { doc, setDoc } from "firebase/firestore";

export default {
  setup() {
    let { error, addDocument, newDocId } = createDocument("users");

    let name = ref(null);
    let email = ref(null);
    let password = ref(null);
    let cpassword = ref(null);
    let currency = ref("");

    let router = useRouter();

    // creating user process
    let handleCreate = async () => {
      if (password.value !== cpassword.value) {
        error.value = "Password and Confirm Password do not match!";
      } else {
        error.value = null;

        try {
          let userCredential = await createUserWithEmailAndPassword(
            auth,
            email.value,
            password.value
          );
          let userId = userCredential.user.uid;

          let userRef = doc(db, "users", userId);
          await setDoc(userRef, {
            name: name.value,
            balance: 0,
            profile:
              "data:image/png;base64,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",
            currency: currency.value                          
          });

          alert("A new account is created...");
          router.go();
        } catch (err) {
          error.value = err.message;
        }
      }
      
    };

    return { name, email, password, cpassword, currency, error, handleCreate };
  },
};
</script>

<style></style>
