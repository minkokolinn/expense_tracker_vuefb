import { db } from "@/firebase/config";
import { collection, getDocs, query } from "firebase/firestore";
import { ref } from "vue"

let getUsers = ()=>{
    let users = ref([]);
    let error = ref(null);

    let load = async () => {
        try {
            let colQuery = query(collection(db,"users"));
            let colSnap = await getDocs(colQuery)
            
            users.value=colSnap.docs.map(docSnap=>{
                return {id:docSnap.id, ...docSnap.data()}
            })
        } catch (err) {
            console.log(err.message);
        }
    }

    return {users, error, load}
}

export default getUsers;