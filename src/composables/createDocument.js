import { db } from "@/firebase/config";
import { addDoc, collection } from "firebase/firestore";
import { ref } from "vue";

let createDocument = (colName) => {
  let error = ref(null);

  let addDocument = async (docObj) => {
    try {
      let colRef = collection(db, colName);
      await addDoc(colRef, docObj);
    } catch (err) {
        console.log(err.message);
        error.value = err.message;
    }
  };

  return {error, addDocument}
};

export default createDocument;
