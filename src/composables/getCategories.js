import { db } from "@/firebase/config";
import { collection, getDocs, query } from "firebase/firestore";
import { ref } from "vue";

let getCategories = () => {
  let categories = ref([]);
  let error = ref(null);

  let load = async () => {
    try {
      let colQuery = query(collection(db, "categories"));
      let colSnap = await getDocs(colQuery);

      categories.value = colSnap.docs.map((docSnap) => {
        return { id: docSnap.id, ...docSnap.data() };
      });
    } catch (err) {
      console.log(err.message);
      error.value = err.message;
    }
  };
  return {load,categories,error}
};

export default getCategories;
