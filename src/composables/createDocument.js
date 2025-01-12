import { db } from "@/firebase/config";
import { addDoc, collection } from "firebase/firestore";
import { ref } from "vue";

let createDocument = (colName) => {
  let error = ref(null);
  let newDocId = ref(null);

  let addDocument = async (docObj) => {
    try {
      let colRef = collection(db, colName);
      let docRef = await addDoc(colRef, docObj);
      newDocId.value = docRef.id;
    } catch (err) {
        console.log(err.message);
        error.value = err.message;
    }
  };

  return {error, addDocument, newDocId}
};

export default createDocument;
