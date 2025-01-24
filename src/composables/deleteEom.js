import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

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

let doUpcomingEoms = async (
  userId,
  targetYear,
  targetMonth,
  netBalanceChange
) => {
  let eomColRef = collection(db, "eoms");
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth() + 1;
  let monthsToProcess = getMonthsBetween(
    targetYear,
    targetMonth,
    currentYear,
    currentMonth
  );
  monthsToProcess.forEach(async (m) => {
    let mQuery = query(
      eomColRef,
      where("userId", "==", userId),
      where("year", "==", m.year),
      where("month", "==", m.month)
    );
    let mColSnap = await getDocs(mQuery);
    if (mColSnap.docs.length === 1) {
      let mDocSnap = mColSnap.docs[0];
      let balanceUpdate = mDocSnap.data().balance;
      balanceUpdate += netBalanceChange;
      await updateDoc(mDocSnap.ref, { balance: balanceUpdate });
    }
  });
};

let deleteEom = async (userId, targetYear, targetMonth, netBalanceChange) => {
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
    let targetEomDocSnap = targetEomColSnap.docs[0];
    let balanceUpdate = targetEomDocSnap.data().balance;
    balanceUpdate += netBalanceChange;
    await updateDoc(targetEomDocSnap.ref, { balance: balanceUpdate });

    // operate transaction for upcoming eom
    await doUpcomingEoms(userId, targetYear, targetMonth, netBalanceChange);
  }
};
export default deleteEom;
