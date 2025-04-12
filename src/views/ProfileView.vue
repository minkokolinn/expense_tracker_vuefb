<template>
  <div v-if="user" class="container pt-4 bg-white">
    <ProfileNavbar :user="user"></ProfileNavbar>
    <hr />
    <div class="text-center">
      <img
        :src="user.profile"
        class="rounded-circle"
        style="width: 100px"
        alt="Avatar"
      />
      <h2 class="mt-3 fw-bold">{{ user.name }}</h2>
    </div>
    <hr />
    <div v-if="errorDataDeleting" class="alert alert-danger text-center">
      Failed to delete data!!!
    </div>
    <div v-if="successDataDeleting" class="alert alert-success text-center">
      Successfully deleted all data
    </div>
    <div class="text-center">
      <div class="mb-3">
        <button class="btn btn-danger" @click="clickDeleteData">
          Delete all data
        </button>
      </div>
      <div>
        <p class="text-muted">
          make sure you have no existing data before deleting your account!!!
        </p>
      </div>
      <div>
        <button class="btn btn-danger" @click="clickDeleteAccount">
          Delete my account
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import ProfileNavbar from "../components/ProfileNavbar";
import getUser from "@/composables/getUser";
import { db, deleteUser, auth } from "@/firebase/config";
import { ref } from "vue";
import { useRouter } from "vue-router";
export default {
  components: {
    ProfileNavbar,
  },
  props: ["userId"],
  setup(props) {
    // console.log(props.authuser);
    let errorDataDeleting = ref(false);
    let successDataDeleting = ref(false);
    let router = useRouter();
    // getting user info
    let { loadUser, user, errorUser } = getUser(props.userId);
    loadUser();
    if (errorUser.value) {
      router.push("/");
    }

    // delete data
    let deleteData = async () => {
      try {
        const deleteBatch = async (querySnapshot) => {
          let batch = writeBatch(db);
          querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });
          await batch.commit();
        };

        let transToDeleteQuery = query(
          collection(db, "transactions"),
          where("userId", "==", user.value.id)
        );
        let transSnap = await getDocs(transToDeleteQuery);
        let transDocs = transSnap.docs;
        while (transDocs.length) {
          await deleteBatch(transDocs.splice(0, 500));
        }

        let eomsToDeleteQuery = query(
          collection(db, "eoms"),
          where("userId", "==", user.value.id)
        );
        let eomsSnap = await getDocs(eomsToDeleteQuery);
        let eomsDocs = eomsSnap.docs;
        while (eomsDocs.length) {
          await deleteBatch(eomsDocs.splice(0, 500));
        }

        let userDoc = doc(db, "users", user.value.id);
        await updateDoc(userDoc, { balance: 0 });

        successDataDeleting.value = true;
      } catch (error) {
        errorDataDeleting.value = true;
        console.log(error);
      }
    };
    let clickDeleteData = async () => {
      let transactionQuery = query(
        collection(db, "transactions"),
        where("userId", "==", user.value.id)
      );
      let transactionColSnap = await getDocs(transactionQuery);
      let eomQuery = query(
        collection(db, "eoms"),
        where("userId", "==", user.value.id)
      );
      let eomColSnap = await getDocs(eomQuery);
      if (transactionColSnap.docs.length > 0 || eomColSnap.docs.length > 0) {
        if (confirm("Are you sure to delete all your data?")) {
          await deleteData();
        } else {
        }
      } else {
        alert("No Data Found To Delete");
      }
    };

    // delete account
    let deleteUserAccount = async () => {
      try {
        let batch = writeBatch(db);
        let userDoc = doc(db, "users", user.value.id);
        batch.delete(userDoc);
        await batch.commit();

        let authuser = auth.currentUser;
        deleteUser(authuser)
          .then(() => {
            alert("Deleted your account...");
            router.push("/");
          })
          .catch((err) => {
            alert("Error deleting user");
            if (err.code === "auth/requires-recent-login") {
              alert("User needs to re-authenticate before deletion.");
            }
          });
      } catch (error) {
        console.log(error);
      }
    };
    let clickDeleteAccount = async () => {
      let transactionQuery = query(
        collection(db, "transactions"),
        where("userId", "==", user.value.id)
      );
      let transactionColSnap = await getDocs(transactionQuery);
      let eomQuery = query(
        collection(db, "eoms"),
        where("userId", "==", user.value.id)
      );
      let eomColSnap = await getDocs(eomQuery);
      if (transactionColSnap.docs.length > 0 || eomColSnap.docs.length > 0) {
        alert(
          "You Can't Delete Account! Please remove all existing data first"
        );
      } else {
        if (confirm("Are you sure to delete your account?")) {
          await deleteUserAccount();
        }
      }
    };

    return {
      user,
      clickDeleteData,
      errorDataDeleting,
      successDataDeleting,
      clickDeleteAccount,
    };
  },
};
</script>

<style></style>
