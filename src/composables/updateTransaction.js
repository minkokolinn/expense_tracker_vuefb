import { db } from "@/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref } from "vue";

let updateTransaction = () => {
  let errorUpdate = ref(null);
  let successUpdate = ref(null);
  let doUpdate = async (tidToUpdate, newTransaction) => {
    try {
      let transactionRef = doc(db, "transactions", tidToUpdate);
      let transactionSnap = await getDoc(transactionRef);
      if (transactionSnap.exists()) {
        let oldTransaction = transactionSnap.data();
        let userId = oldTransaction.userId;
        let oldAmount = oldTransaction.amount;
        let oldType = oldTransaction.type;

        await updateDoc(transactionRef, newTransaction);

        // update user balance
        let userRef = doc(db, "users", userId);
        let userSnap = await getDoc(userRef);
        let userBalance = userSnap.data().balance;

        if (oldType === "in") {
          userBalance -= oldAmount;
        } else if (oldType === "out") {
          userBalance += oldAmount;
        }

        if (newTransaction.type === "in") {
          userBalance += newTransaction.amount;
        } else if (newTransaction.type === "out") {
          userBalance -= newTransaction.amount;
        }

        await updateDoc(userRef, {balance:userBalance});
        successUpdate.value = "Transaction Updated Successfully..."
      }else{
        console.log("Transaction Not Found!");
        errorUpdate.value = "Transaction Not Found To Update!"
      }
    } catch (err) {
      console.error(err);
      errorUpdate.value = err.message;
    }
  };

  return {doUpdate,errorUpdate,successUpdate}
};

export default updateTransaction;
