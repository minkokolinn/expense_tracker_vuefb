import { count } from "firebase/firestore";

let categoricalExpenses = (transactions) => {
  let totalExpenseByCategory = {};
  totalExpenseByCategory["Total"] = 0;
  
  transactions.forEach((transaction) => {
    
    if (transaction.type === "out" && transaction.catId.id != "cat5") {
      totalExpenseByCategory["Total"]+=transaction.amount;
      if (totalExpenseByCategory[transaction.catId.name]) {
        totalExpenseByCategory[transaction.catId.name] += transaction.amount;
      } else {
        totalExpenseByCategory[transaction.catId.name] = transaction.amount;
      }
    }
  });
  
  return totalExpenseByCategory;
};
export default categoricalExpenses;
