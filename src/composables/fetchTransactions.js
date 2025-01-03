import { db } from "@/firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ref, watch } from "vue";

let fetchTransactions = (userId, month, year) => {
  let errorTransactions = ref(null);
  let transactions = ref([]);
  
  let loadTransactions = async () => {
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", userId),
      where("date", ">=", new Date(year, month - 1, 1)),
      where("date", "<=", new Date(year, month, 0)),
      orderBy("date", "desc")
    );
    onSnapshot(q, (colSnap) => {
      transactions.value = colSnap.docs.map(async (docSnap) => {
        let transactionData = docSnap.data();
        return {
          ...transactionData
        };
      });
    });
  };

  return { loadTransactions, transactions, errorTransactions };
};

export default fetchTransactions;
