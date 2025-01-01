import { db } from "@/firebase/config"
import { doc, getDoc } from "firebase/firestore"

let checkUserExists = async(uidtocheck)=>{
    const userRef = doc(db,"users",uidtocheck);
    const userSnap = await getDoc(userRef);
    if(!userSnap.exists()){
        return false;
    }else{
        return true;
    }
}

export default checkUserExists;