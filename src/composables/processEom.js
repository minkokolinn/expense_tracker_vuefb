import { db } from "@/firebase/config";
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import createDocument from "./createDocument";

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

let doUpcomingEoms = async (userId, targetYear, targetMonth, amount, type) => {
  let { error, addDocument, newDocId } = createDocument("eoms");
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
      let existingBalance = mDocSnap.data().balance;
      if(type=="in"){
        existingBalance+=amount;
      }else if(type=="out"){
        existingBalance-=amount;
      }
      await updateDoc(mDocSnap.ref,{balance:existingBalance});
    }else{
      let tempBalance = 0;
      if(type=="in"){
        tempBalance+=amount;
      }else if(type=="out"){
        tempBalance-=amount;
      }
      await addDocument({
        userId: userId,
        year: m.year,
        month: m.month,
        balance: tempBalance,
      });
    }
  })
};

let processEom = async (userId, targetYear, targetMonth, amount, type) => {
  let eomColRef = collection(db, "eoms");
  let balanceInsert = 0;
  let { error, addDocument, newDocId } = createDocument("eoms");
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
    let balanceUpdate = targetEomDocSnap.data().balance;
    if(type=="in"){
      balanceUpdate += amount;
    }else if(type=="out"){
      balanceUpdate -= amount;
    }
    await updateDoc(targetEomDocSnap.ref, {balance:balanceUpdate});
    // operate transaction for upcoming eom
    await doUpcomingEoms(userId,targetYear,targetMonth,amount,type);
  } else {
    // if not exists
    // operate transaction with prev eom and add as current
    let prevMonthIndex = {
      year: targetMonth === 1 ? targetYear - 1 : targetYear,
      month: targetMonth === 1 ? 12 : targetMonth - 1,
    };
    let prevEomQuery = query(
      eomColRef,
      where("userId", "==", userId),
      where("year", "==", prevMonthIndex.year),
      where("month", "==", prevMonthIndex.month)
    );
    let prevEomColSnap = await getDocs(prevEomQuery);
    if (prevEomColSnap.docs.length === 1) {
      // if found previous month eom
      let prevEomDocSnap = prevEomColSnap.docs[0];
      balanceInsert = prevEomDocSnap.data().balance;
      if (type == "in") {
        balanceInsert += amount;
      } else if (type == "out") {
        balanceInsert -= amount;
      }
    } else {
      // previous month eom is not found, just add the amount to balance
      if (type == "in") {
        balanceInsert += amount;
      } else if (type == "out") {
        balanceInsert -= amount;
      }
    }
    await addDocument({
      userId: userId,
      year: targetYear,
      month: targetMonth,
      balance: balanceInsert,
    });
    // operate transaction for upcoming eom
    await doUpcomingEoms(userId,targetYear,targetMonth,amount,type);
  }
};
export default processEom;
