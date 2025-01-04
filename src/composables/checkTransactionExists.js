import { db } from "@/firebase/config"
import { doc, getDoc } from "firebase/firestore"

let checkTransactionExists = async(tidtocheck)=>{
    const transactionRef = doc(db,"transactions",tidtocheck);
    const transactionSnap = await getDoc(transactionRef);
    if(!transactionSnap.exists()){
        return false;
    }else{
        return true;
    }
}

export default checkTransactionExists;