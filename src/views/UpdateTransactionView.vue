<template>
  <div class="container vh-100 pt-5">
    <router-link v-if="userId"
      :to="{ name: 'DashboardView', params: { userId: userId } }"
      class="backbtn"
    >
      <i class="fas fa-chevron-left"></i>
      <span>Back</span>
    </router-link>
    <h1 class="text-center">Update Transaction</h1>
    <div v-if="successUpdate=='Transaction Updated Successfully...'" class="alert alert-success" role="alert">
      {{ successUpdate }}
    </div>
    <div v-if="errorUpdate" class="alert alert-danger" role="alert">
      {{ errorUpdate }}
    </div>
    <form @submit.prevent="submitUpdate">
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
        <div class="row" v-if="type !== 'in'">
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
              <button
                type="submit"
                class="btn btn-outline-dark w-25 mt-3"
                :disabled="loadingUpdate"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useRouter } from "vue-router";
import getCategories from "@/composables/getCategories";
import updateTransaction from "@/composables/updateTransaction";

export default {
  props: ["tidToUpdate"],
  setup(props) {
    let router = useRouter();

    // importing utilities
    let { load, categories, error } = getCategories();
    load();

    // bind field
    let date = ref(null);
    let type = ref(null);
    let selectcategory = ref(null);
    let title = ref(null);
    let amount = ref(null);
    let userId = ref(null);

    // waiting for loading update or update to be completed
    let loadingUpdate = ref(false);

    onMounted(async () => {
      const transactionRef = doc(db, "transactions", props.tidToUpdate);
      const transactionSnap = await getDoc(transactionRef);
      if (transactionSnap.exists()) {
        const oldTransaction = transactionSnap.data();

        const timestamp = oldTransaction.date;
        const dateObj = new Date(timestamp.toDate());
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth()+1).padStart(2,'0');
        const day = String(dateObj.getDate()).padStart(2,'0');
        const formattedDate = `${year}-${month}-${day}`;
        date.value = formattedDate;
        type.value = oldTransaction.type;
        selectcategory.value = oldTransaction.catId;
        title.value = oldTransaction.title;
        amount.value = oldTransaction.amount;
        userId.value = oldTransaction.userId;
      } else {
        alert("Trasaction Not Found!");
        router.push("/");
      }
    });

    // update process
    let {doUpdate,errorUpdate,successUpdate} = updateTransaction()
    let submitUpdate = async () => {
      if(loadingUpdate.value){
        alert("Wait for the transaction to be completed")
        return;
      }
      loadingUpdate.value = true;
      let tempdate = new Date(date.value);
      tempdate.setHours(0, 0, 0, 0);
      let newTransaction = {
        date: Timestamp.fromDate(tempdate),
        title: title.value,
        amount: amount.value,
        type: type.value,
        catId: type.value==='in'?'':selectcategory.value,
        userId: userId.value,
      };
      await doUpdate(props.tidToUpdate,newTransaction);
      
      loadingUpdate.value = false;
    };

    return {
      categories,
      userId,
      date,
      type,
      selectcategory,
      title,
      amount,
      loadingUpdate,
      submitUpdate,
      errorUpdate,
      successUpdate
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
