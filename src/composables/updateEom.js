import { db } from "@/firebase/config";
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";

let getMonthsBetween = (targetYear, targetMonth, currentYear, currentMonth) => {
  let months = [];
  let year = targetYear;
  let month = targetMonth;
  if (month === 12) {
    month = 1;
    year++;
  } else {
    month++;
  }
  while (
    year < currentYear ||
    (year === currentYear && month <= currentMonth)
  ) {
    months.push({ year: year, month: month });
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }
  return months;
};

let updateEachEom = async(eomToUpdate, oldTransaction, newTransaction)=>{ //expecting snap obj
  let oldTransactionType = oldTransaction.data().type;
  let oldTransactionAmount = oldTransaction.data().amount;

  let newTransactionType = newTransaction.type;
  let newTransactionAmount = newTransaction.amount;

  let eomBalanceToUpdate = eomToUpdate.data().balance;
  
  if(oldTransactionType==="in"){
    eomBalanceToUpdate -= oldTransactionAmount;
  }else if(oldTransactionType==="out"){
    eomBalanceToUpdate += oldTransactionAmount;
  }

  if(newTransactionType==="in"){
    eomBalanceToUpdate += newTransactionAmount;
  }else if(newTransactionType==="out"){
    eomBalanceToUpdate -= newTransactionAmount;
  }

  await updateDoc(eomToUpdate.ref, {balance:eomBalanceToUpdate});
}

let doUpcomingEoms = async (userId, targetYear, targetMonth, oldTransaction, newTransaction) => {
  let eomColRef = collection(db, "eoms");
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth() + 1;
  let monthsToProcess = getMonthsBetween(
    targetYear,
    targetMonth,
    currentYear,
    currentMonth
  );
  monthsToProcess.forEach(async m=>{
    let mQuery = query(
      eomColRef,
      where("userId","==",userId),
      where("year","==",m.year),
      where("month","==",m.month)
    );
    let mColSnap = await getDocs(mQuery);
    if(mColSnap.docs.length===1){
      let mDocSnap = mColSnap.docs[0];
      
      await updateEachEom(mDocSnap,oldTransaction,newTransaction);
    }
  })
};

let updateEom = async (userId, targetYear, targetMonth, oldTransaction, newTransaction) => {
  let eomColRef = collection(db, "eoms");
  
  // check if eom exists for target Year and target Month
  let targetEomQuery = query(
    eomColRef,
    where("userId", "==", userId),
    where("year", "==", targetYear),
    where("month", "==", targetMonth)
  );
  let targetEomColSnap = await getDocs(targetEomQuery);
  if (targetEomColSnap.docs.length === 1) {
    // if exists
    // operate transaction with the current eom
    let targetEomDocSnap=targetEomColSnap.docs[0];
    await updateEachEom(targetEomDocSnap, oldTransaction, newTransaction);
    
    // operate transaction for upcoming eom
    await doUpcomingEoms(userId,targetYear,targetMonth,oldTransaction,newTransaction);
  }
};
export default updateEom;
