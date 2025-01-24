import { db } from "@/firebase/config";
import { doc, getDoc, updateDoc, writeBatch } from "firebase/firestore";
import { ref } from "vue";
import deleteEom from "@/composables/deleteEom";

let deleteTransactions = () => {
  let errorDelete = ref(null);
  let successDelete = ref(null);
  let doDelete = async (tidTodelete) => {
    try {
      const batch = writeBatch(db);
      let tempTransactions = await Promise.all(
        tidTodelete.map(async (tid) => {
          const docRef = doc(db, "transactions", tid);
          const docSnap = await getDoc(docRef);
          batch.delete(docRef);
          return { id: docSnap.id, ...docSnap.data() };
        })
      );
      await batch.commit();
      // console.log("reponse from batch commit "+response);
      successDelete.value = "Transactions deleted successfully!";

      // after resolve temptransactionk, got array of docsnap
      let userRef = doc(db, "users", tempTransactions[0].userId);
      let userSnap = await getDoc(userRef);
      let userBalance = userSnap.data().balance;

      let totalAmount = tempTransactions.reduce((acc, transaction) => {
        if (transaction.type === "in") {
          return acc - transaction.amount;
        } else if (transaction.type === "out") {
          return acc + transaction.amount;
        }
        return acc;
      }, 0);

      userBalance += totalAmount;
      await updateDoc(userRef, { balance: userBalance });

      // update eom
      let targetDate = new Date(tempTransactions[0].date.toDate());
      let targetYear = targetDate.getFullYear();
      let targetMonth = targetDate.getMonth()+1;
      await deleteEom(userSnap.id,targetYear,targetMonth,totalAmount);
      
    } catch (err) {
      console.error("Error deleting documents:", err);
      if (err.writeResults) {
        let failedDoc = [];
        err.writeResults.forEach((result, index) => {
          if (!result.success) {
            failedDoc.push(tidTodelete[index]);
          }
        });
        errorDelete.value = `Failed to delete these documents : ${failedDoc}`;
      } else {
        errorDelete.value = err.message;
      }
    }
  };
  return { doDelete, errorDelete, successDelete };
};

export default deleteTransactions;
