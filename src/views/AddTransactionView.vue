<template>
  <div class="container vh-100 pt-5">
    <router-link
      :to="{ name: 'DashboardView', params: { userId: userId } }"
      class="backbtn"
    >
      <i class="fas fa-chevron-left"></i>
      <span>Back</span>
    </router-link>
    <h1 class="text-center">Add Transaction</h1>
    <div v-if="alert_success" class="alert alert-success" role="alert">
      Transaction added successfully!
    </div>
    <form @submit.prevent="addTransaction">
      <div>
        <div class="row">
          <div class="mx-auto col-12 col-sm-10 col-md-6 mt-1">
            <label for="dateId" class="ms-2 mb-2">Date</label>
            <input
              v-model="date"
              type="date"
              class="form-control"
              name=""
              id="dateId"
              required
            />
          </div>
        </div>
        <!-- radio -->
        <div class="row">
          <div class="mx-auto col-12 col-sm-10 col-md-6 mt-2">
            <div class="row ms-2">
              <div class="form-check col-6">
                <input
                  v-model="type"
                  class="form-check-input"
                  type="radio"
                  name="transaction_type"
                  value="out"
                  id="cashoutid"
                  checked
                />
                <label class="form-check-label" for="cashoutid">
                  Cash Out
                </label>
              </div>
              <div class="form-check col-6">
                <input
                  v-model="type"
                  class="form-check-input"
                  type="radio"
                  name="transaction_type"
                  value="in"
                  id="cashinid"
                />
                <label class="form-check-label" for="cashinid"> Cash In </label>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-if="type!=='in'">
          <div class="mx-auto col-12 col-sm-10 col-md-6 mt-4">
            <label for="categoryId" class="form-label ms-2 mb-2"
              >Category</label
            >
            <select
              v-model="selectcategory"
              class="form-select"
              id="categoryId"
              aria-label="Default select example"
              required
            >
              <option
                :value="category"
                v-for="category in categories"
                :key="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="mx-auto col-12 col-sm-10 col-md-6 mt-4">
            <div class="form-floating p-0 mt-2">
              <input
                type="text"
                v-model="title"
                class="form-control ps-4"
                id="titleId"
                placeholder="name@example.com"
                required
              />
              <label for="titleId" class="ps-4">Title</label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="mx-auto col-12 col-sm-10 col-md-6 mt-2">
            <div class="form-floating p-0 mt-2">
              <input
                type="number"
                v-model="amount"
                class="form-control ps-4"
                id="amountId"
                placeholder="name@example.com"
                required
              />
              <label for="amountId" class="ps-4">Amount</label>
            </div>
            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-outline-dark w-25 mt-3">
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import getCategories from "@/composables/getCategories";
import { ref, watch } from "vue";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import createDocument from "@/composables/createDocument";
import { db } from "@/firebase/config";
export default {
  props: ["userId"],
  setup(props) {
    let alert_success = ref(false);
    // importing utilities
    let { load, categories, error } = getCategories();
    load();
    let { errorInsert, addDocument } = createDocument("transactions");

    // getting today date
    let todayDate = new Date().toLocaleDateString('en-CA');

    // bind field
    let date = ref(todayDate);
    let type = ref("out");
    let selectcategory = ref(null);
    watch(categories, (newCategories) => {
      if (newCategories.length > 0) {
        selectcategory.value = newCategories[0];
      }
    });
    let title = ref(null);
    let amount = ref(null);
    let userId = ref(props.userId);

    let addTransaction = async () => {
      let tempdate = new Date(date.value);
      tempdate.setHours(0, 0, 0, 0);
      let newTrasaction = {
        date: Timestamp.fromDate(tempdate),
        title: title.value,
        amount: amount.value,
        type: type.value,
        catId: type.value==='in'?'':selectcategory.value,
        userId: userId.value,
      };
      await addDocument(newTrasaction);
      await updateBalance(userId.value, amount.value, type.value);
      alert_success.value = true;
      type.value = "out";
      selectcategory.value = categories.value[0];
      title.value = null;
      amount.value = null;
      setTimeout(() => {
        alert_success.value = false;
      }, 2000);
    };

    let updateBalance = async (userId, amount, type) => {
      let userRef = doc(db, "users", userId);
      let userSnap = await getDoc(userRef);
      let userBalance = userSnap.data().balance || 0;
      if (type === "out") {
        userBalance -= amount;
      } else if (type === "in") {
        userBalance += amount;
      }
      await updateDoc(userRef, { balance: userBalance });
    };

    return {
      date,
      type,
      selectcategory,
      title,
      amount,
      categories,
      addTransaction,
      alert_success,
      userId,
    };
  },
};
</script>

<style scoped>
.backbtn {
  text-decoration: none;
  font-weight: bold;
  font-size: 20px;
}
</style>
