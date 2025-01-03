<template>
  <div v-if="user" class="container pt-5 bg-white">
    <div class="flex-row d-flex justify-content-between align-items-center">
      <div class="ms-2 ms-lg-5">
        <h1 class="text-center mb-3" style="font-size: 26px">
          <router-link to="/" class="backbtn">
            <i class="fas fa-long-arrow-alt-left"></i>
          </router-link>
          Dashboard
        </h1>
      </div>
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
        <p class="fw-bold mb-0 ms-2" style="font-size: 14px">{{ user.name }}</p>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-12 col-lg-4 px-3 px-lg-5">
        <div
          class="bg-primary d-flex flex-column align-items-center ps-5 pt-4"
          style="
            width: 100%;
            height: 150px;
            border-radius: 40px;
            box-shadow: 5px 10px;
          "
        >
          <span
            class="text-white fw-bold"
            style="font-size: 1.5rem; align-self: start"
            >Balance</span
          >
          <div class="d-flex align-items-center">
            <span
              class="fw-bold text-white"
              style="font-size: 2rem; margin-right: 10px"
              >{{ user.balance }}</span
            >
            <span class="text-white">Bhat</span>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-8 px-5 mt-5 mt-lg-0">
        <div class="w-100 float-right">
          <h3 class="progress-title" style="font-size: 1.1rem">
            Food & Beverage
          </h3>
          <div class="progress pink">
            <div class="progress-bar" style="width: 90%; background: #ff4b7d">
              <div>90%</div>
            </div>
          </div>

          <h3 class="progress-title" style="font-size: 1.1rem">
            Transportation
          </h3>
          <div class="progress green">
            <div class="progress-bar" style="width: 75%; background: #5fad56">
              <div>75%</div>
            </div>
          </div>

          <h3 class="progress-title" style="font-size: 1.1rem">
            Monthly Expense
          </h3>
          <div class="progress yellow">
            <div class="progress-bar" style="width: 50%; background: #e8d324">
              <div>75%</div>
            </div>
          </div>

          <h3 class="progress-title" style="font-size: 1.1rem">
            Ocasional Expense
          </h3>
          <div class="progress blue">
            <div class="progress-bar" style="width: 25%; background: #3485ef">
              <div>75%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4 px-2 px-lg-2">
      <div class="col-12 col-lg-8 offset-lg-4 px-3 px-lg-5">
        <div class="row align-items-center">
          <h4 class="col-lg-6 col-12">Transactions</h4>
          <div class="col-lg-6 col-12 d-flex justify-content-end">
            <Filter></Filter>
          </div>
        </div>
        {{ isLoading }}
        <div v-if="isLoading">
          <Spinner></Spinner>
        </div>
        <div v-else>
          <div
            class="card-background row ps-2 ps-lg-4 my-3 py-3"
            style="border-radius: 20px; box-shadow: 3px 6px"
          >
            <div class="col-3 col-lg-2 d-flex align-items-center">
              <i
                class="fas fa-hamburger p-3 bg-primary rounded-3 text-white"
                style="font-size: 30px"
              ></i>
            </div>
            <div
              class="col-5 col-lg-7 d-flex flex-column align-items-start mt-1 p-0"
            >
              <p class="m-0 fs-5">Pizza</p>
              <p class="m-0 fs-6">Food & Beverage</p>
            </div>
            <div
              class="col-4 col-lg-3 d-flex align-items-center justify-content-end lh-1 pe-4"
            >
              <div class="d-flex flex-wrap align-items-center">
                <p class="m-0 fs-4 ms-auto">-</p>
                <p class="m-0 ps-1 fs-5 text-break">522</p>
                <p class="m-0 ps-1 fs-6 ms-auto">Bhat</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <router-link
      :to="{ name: 'AddTransactionView', params: { userId: user.id } }"
    >
      <div class="fab-container">
        <button class="fab" @click="handleClick">
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </router-link>
  </div>
</template>

<script>
import Spinner from '../components/Spinner'
import Filter from "../components/Filter";
import { ref, watch } from "vue";
import getUser from "@/composables/getUser";
import fetchTransactions from "@/composables/fetchTransactions";
import { useRouter } from "vue-router";
export default {
  components: {
    Spinner, Filter },
  props: ["userId"],
  setup(props) {
    let userId = ref(props.userId);
    let router = useRouter();
    let isLoading = ref(true);
    // getting user info
    let { loadUser, user, errorUser } = getUser(userId.value);
    loadUser();
    if (errorUser.value) {
      router.push("/");
    }

    // fetching transactions
    let { loadTransactions, transactions, errorTransactions } =
      fetchTransactions(userId.value, 1, 2025);
    loadTransactions().then((data) => {
      setTimeout(()=>{
        isLoading.value = false;
      },2000)
      console.log(transactions.value);
    });

    return {
      user,
      transactions,
      isLoading,
    };
  },
};
</script>

<style scoped>
.progress {
  height: 10px;
  background: #cbcbcb;
  border-radius: 0;
  box-shadow: none;
  margin-bottom: 20px;
  overflow: visible;
}
.progress .progress-bar {
  box-shadow: none;
  position: relative;
  -webkit-animation: animate-positive 2s;
  animation: animate-positive 2s;
}

.progress.pink .progress-bar:after {
  border-bottom-color: #ff4b7d;
}
.progress.green .progress-bar:after {
  border-bottom-color: #5fad56;
}
.progress.yellow .progress-bar:after {
  border-bottom-color: #e8d324;
}
.progress.blue .progress-bar:after {
  border-bottom-color: #3485ef;
}
@-webkit-keyframes animate-positive {
  0% {
    width: 0;
  }
}
@keyframes animate-positive {
  0% {
    width: 0;
  }
}
.card-background {
  background-color: #f1f1f1;
}
.backbtn {
  text-decoration: none;
  font-weight: bold;
  font-size: 25px;
}
.fab-container {
  position: fixed;
  bottom: 50px;
  right: 40px;
  z-index: 1;
}
.fab {
  background-color: #0c6dfd;
  color: #fff;
  padding: 10px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-size: 50px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.fab:hover {
  background-color: #08439b;
}
</style>
