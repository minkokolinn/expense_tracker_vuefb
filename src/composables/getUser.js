import { db } from "@/firebase/config";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { ref } from "vue";

let getUser = (userId) => {
  let user = ref(null);
  let error = ref(null);
  let load = async () => {
    try {
      let userDocRef = doc(db, "users", userId);
      onSnapshot(userDocRef, userDocSnap=>{
        if(userDocSnap.exists()){
          user.value = {id:userDocSnap.id,...userDocSnap.data()}
        }else{
          user.value = null
        }
      })
    } catch (err) {
      console.log(err.message);
      error.value = err.message;
    }
  };
  return {load,user,error}
};

export default getUser;
