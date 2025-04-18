import { db } from "@/firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { ref } from "vue";

let fetchTransactions = () => {
  let errorTransactions = ref(null);
  let transactions = ref([]);

  let loadTransactions = async (userId, month, year) => {
    try {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      const q = query(
        collection(db, "transactions"),
        where("userId", "==", userId),
        where("date", ">=", start),
        where("date", "<=", end),
        orderBy("date", "desc")
      );
      onSnapshot(q, (colSnap) => {
        transactions.value = colSnap.docs.map((docSnap) => {
          let transactionData = docSnap.data();
          return {
            id: docSnap.id,
            ...transactionData,
          };
        });
      });
    } catch (err) {
      if (err instanceof Error && err.message.includes("Failed to fetch")) {
        // Internet disconnected error
        console.log(
          "Internet disconnected. Please check your connection and try again."
        );
        errorTransactions.value =
          "Internet disconnected. Please check your connection and try again.";
      } else {
        // Other error
        console.log(err.message);
        errorTransactions.value = err.message;
      }
    }
  };

  return { loadTransactions, transactions, errorTransactions };
};

export default fetchTransactions;
