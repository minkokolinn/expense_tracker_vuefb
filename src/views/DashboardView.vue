<template>
  <div v-if="user" class="container pt-4 bg-white">
    <DashboardNavbar :user="user" :authuser="authuser"></DashboardNavbar>
    <div class="row mt-3">
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
            <span class="text-white">{{ user.currency }}</span>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-8 mt-5 px-5 mt-lg-0">
        <div class="w-100 float-right">
          <h6 class="text-end fw-bold mb-0" style="text-decoration: underline">
            {{ new Date().toLocaleDateString("default", { month: "long" }) }},
            {{ new Date().getFullYear() }}
          </h6>
          <div v-for="(value, key, index) in totalExpenseByCategory" :key="key">
            <h3 class="progress-title" style="font-size: 1.1rem">
              {{ key }} - {{ value }} bahts
            </h3>
            <div class="progress">
              <div
                class="progress-bar"
                :style="{
                  width: (value / totalExpenseByCategory['Total']) * 100 + '%',
                  backgroundColor: catColors[index],
                }"
              >
                <div>
                  {{
                    ((value / totalExpenseByCategory["Total"]) * 100).toFixed(
                      2
                    )
                  }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-4 px-2 px-lg-2">
      <div class="col-12 col-lg-8 offset-lg-4 px-3 px-lg-5">
        <div class="row align-items-center mb-2">
          <h4 class="col-lg-6 col-12">Transactions</h4>
          <div
            class="col-lg-6 col-12 d-flex justify-content-end align-items-center"
          >
            <Filter @filterSelectChange="filterSelectChange"></Filter>
            <span
              v-if="authuser && user.id==authuser.uid"
              class="text-primary fw-bold mx-2 selectText"
              @click="toggleSelect"
              >{{ statusCheckbox === true ? "Deselect" : "Select" }}</span
            >
          </div>
        </div>
        <div v-if="errorTransactions">
          <div class="alert alert-danger my-1">{{ errorTransactions }}</div>
        </div>
        <div v-if="errorDelete">
          <div class="alert alert-danger my-1">{{ errorDelete }}</div>
        </div>
        <div v-if="successDelete">
          <div class="alert alert-success my-1">{{ successDelete }}</div>
        </div>
        <div v-if="isLoading">
          <Spinner></Spinner>
        </div>
        <div v-else-if="!hasTransactions">
          <h3 class="mt-5 text-center">No Transaction Found!</h3>
        </div>
        <div v-else>
          <div
            v-for="(transaction, index) in processedTransactions"
            :key="transaction.id"
          >
            <h6
              v-if="
                index === 0 ||
                !isSameDate(transaction.date, transactions[index - 1].date)
              "
              class="text-muted fw-bold"
            >
              {{
                transaction.date.toDate().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              }}
            </h6>
            <TransactionCard
              :transaction="transaction"
              :showCheckbox="statusCheckbox"
              :user="user"
              @selectedId="selectedIdHandle"
            />
          </div>
        </div>
      </div>
    </div>
    
    <router-link
      v-if="tidsSelected.length === 1"
      :to="{
        name: 'UpdateTransactionView',
        params: { tidToUpdate: tidsSelected[0] },
      }"
    >
      <div v-if="tidsSelected.length === 1" class="fab-edit-container">
        <button class="fab bg-success">
          <i class="fas fa-edit"></i>
        </button>
      </div>
    </router-link>
    <div v-if="tidsSelected.length > 0" class="fab-delete-container">
      <button class="fab bg-danger" @click="handleDelete">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <router-link
      v-if="authuser && user.id==authuser.uid"
      :to="{ name: 'AddTransactionView', params: { userId: user.id } }"
    >
      <div class="fab-container">
        <button class="fab bg-primary">
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </router-link>
    <SelectedTransactionsCard
      :tidsSelected="tidsSelected"
    ></SelectedTransactionsCard>
  </div>
</template>

<script>
import DashboardNavbar from '../components/DashboardNavbar'
import SelectedTransactionsCard from "../components/SelectedTransactionsCard";
import TransactionCard from "../components/TransactionCard";
import Spinner from "../components/Spinner";
import Filter from "../components/Filter";
import {
  computed,
  getTransitionRawChildren,
  onMounted,
  onUpdated,
  ref,
  watch,
} from "vue";
import getUser from "@/composables/getUser";
import fetchTransactions from "@/composables/fetchTransactions";
import { useRouter } from "vue-router";
import {
  collection,
  doc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import deleteTransactions from "@/composables/deleteTransactions";
import categoricalExpenses from "@/composables/categoricalExpenses";
import { db, getCurrentUser } from "@/firebase/config";

export default {
  components: {
    DashboardNavbar,
    SelectedTransactionsCard,
    TransactionCard,
    Spinner,
    Filter,
  },
  props: ["userId"],
  setup(props) {
    let userId = ref(props.userId);
    let router = useRouter();
    let isLoading = ref(true);
    let hasTransactions = ref(false);
    let statusCheckbox = ref(false);
    let tidsSelected = ref([]);
    let eomValue = ref(null);

    
    // getting user info
    let { loadUser, user, errorUser } = getUser(userId.value);
    loadUser();
    if (errorUser.value) {
      router.push("/");
    }
    // getting auth user 
    let authuser = ref(null);
    onMounted(async()=>{
      authuser.value = await getCurrentUser();
    });


    let getEomValue = async (userId, year, month) => {
      let eomQuery = query(
        collection(db, "eoms"),
        where("userId", "==", userId),
        where("year", "==", year),
        where("month", "==", month)
      );
      let eomSnap = await getDocs(eomQuery);
      if (eomSnap.docs.length === 1) {
        let eomDocSnap = eomSnap.docs[0];
        eomValue.value = eomDocSnap.data().balance;
      }
    };

    let { loadTransactions, transactions, errorTransactions } =
      fetchTransactions();
    let totalExpenseByCategory = ref({});

    // handle filter select change
    let filterSelectChange = async ({ selectedMonth, selectedYear }) => {
      // getting eom Balance of selected month and year
      getEomValue(userId.value, selectedYear, selectedMonth);

      isLoading.value = true;
      loadTransactions(userId.value, selectedMonth, selectedYear);
    };

    // first time fetching transactions with current month and year
    loadTransactions(
      userId.value,
      new Date().getMonth() + 1,
      new Date().getFullYear()
    );
    getEomValue(
      userId.value,
      new Date().getFullYear(),
      new Date().getMonth() + 1
    );

    // monitoring and handling transaction data
    watch(transactions, (newTransactions) => {
      if (newTransactions.length > 0) {
        totalExpenseByCategory.value = categoricalExpenses(transactions.value);
        isLoading.value = false;
        hasTransactions.value = true;
      } else {
        setTimeout(() => {
          if (newTransactions.length === 0) {
            isLoading.value = false;
            hasTransactions.value = false;
          }
        }, 500);
      }

      // console.log("From watching transaction");
      // console.log(transactions.value);
    });

    let processedTransactions = computed(() => {
      let tmpBalanceHistory = eomValue.value;
      let isLastRecord = true;
      let preAmount = 0;
      let preType = "";

      return transactions.value.map((transaction) => {
        if (isLastRecord) {
          transaction["balanceHistory"] = tmpBalanceHistory;
          isLastRecord = false;
        } else {
          if (preType == "in") {
            tmpBalanceHistory = tmpBalanceHistory - preAmount;
            transaction["balanceHistory"] = tmpBalanceHistory;
          } else if (preType == "out") {
            tmpBalanceHistory = tmpBalanceHistory + preAmount;
            transaction["balanceHistory"] = tmpBalanceHistory;
          }
        }

        preAmount = transaction.amount;
        preType = transaction.type;

        return transaction;
      });
    });

    // toggle select
    let toggleSelect = () => {
      statusCheckbox.value = !statusCheckbox.value;
      if (statusCheckbox.value === false) {
        tidsSelected.value.length = 0;
      }
    };
    // handle select id
    let selectedIdHandle = (transactionId, checked) => {
      if (checked) {
        tidsSelected.value.push(transactionId);
      } else {
        tidsSelected.value = tidsSelected.value.filter(
          (id) => id !== transactionId
        );
      }
    };

    // handle delete
    let { doDelete, errorDelete, successDelete } = deleteTransactions();
    let handleDelete = async () => {
      if (confirm("Are you sure to delete?")) {
        await doDelete(tidsSelected.value);
        router.go(0);
      } else {
      }
    };
    watch(successDelete, () => {
      if (successDelete.value == "Transactions deleted successfully!") {
        tidsSelected.value.length = 0;
        totalExpenseByCategory.value = categoricalExpenses(transactions.value);
      }
    });

    let catColors = ["black", "green", "blue", "yellow", "red"];

    let isSameDate = (date1, date2) => {
      const date1Date = date1.toDate();
      const date2Date = date2.toDate();
      return (
        date1Date.getFullYear() === date2Date.getFullYear() &&
        date1Date.getMonth() === date2Date.getMonth() &&
        date1Date.getDate() === date2Date.getDate()
      );
    };

    return {
      user,
      authuser,
      transactions,
      processedTransactions,
      errorTransactions,
      isLoading,
      hasTransactions,
      filterSelectChange,
      statusCheckbox,
      selectedIdHandle,
      tidsSelected,
      toggleSelect,
      handleDelete,
      errorDelete,
      successDelete,
      totalExpenseByCategory,
      catColors,
      isSameDate,
      eomValue,
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
  color: #fff;
  padding: 25px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-size: 30px;
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.2);
}
.fab-delete-container {
  position: fixed;
  bottom: 140px;
  right: 40px;
  z-index: 1;
}
.fab-edit-container {
  position: fixed;
  bottom: 230px;
  right: 40px;
  z-index: 1;
}

.fab:hover {
  background-color: #08439b;
}
.selectText {
  cursor: pointer;
}
</style>
