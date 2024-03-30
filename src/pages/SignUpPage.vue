<script setup>
import {computed, ref} from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {addNewUser, getFirestoreDatabase} from "../libs/chatapp_firebase.js";


const firstName = ref("");
const lastName = ref("");
const birthdate = ref(null);
const email = ref("");
const password = ref("");
const validForm = computed(() => firstName.value.trim() && lastName.value.trim() && birthdate.value && email.value.trim() && password.value);
const errorMsg = ref("");

const signUp = async () => {
  if (!validForm.value) return;

  console.log(`SignUpPage.vue: signUp() -> creating an account with details: \n ${firstName.value} \n ${lastName.value} \n ${birthdate.value}`);
  const auth = getAuth();

  try {
    const userCredentials = await createUserWithEmailAndPassword(auth, email.value.trim(), password.value);

    console.log("SignUpPage.signUp() -> Auth added successfully.");


    console.log("SignUpPage.signUp() -> Creating document on Firestore...");

    // add a new document to the user collection
    await addNewUser(email.value, firstName.value, lastName.value, birthdate.value);

    console.log("SignUpPage.signUp() -> Document for new user created.");

    errorMsg.value = "";
  }
  catch (error) {
    console.error(`SignUpPage.signUp() -> Error during account creation: ${error.code}`);

    errorMsg.value = "Oops! Something went wrong.";

    if (error.code === "auth/email-already-in-use") {
      errorMsg.value = "That email address is already in use. Try another :)";
    }
  }
}
</script>


<template>
  <div>
    <h1>Sign Up</h1>
    <div>
      <form @keydown.enter="signUp">
        <label for="first name">First name</label><br>
        <input type="text" required v-model="firstName"><br><br>

        <label for="last name">Last name</label><br>
        <input type="text" required v-model="lastName"><br><br>

        <label for="birthdate">Birthdate</label><br>
        <input type="date" required v-model="birthdate"><br><br>

        <label for="email address">Email address</label><br>
        <input type="email" required placeholder="maybe...elon@musk.com" v-model="email"><br><br>

        <label for="password">Password</label><br>
        <input type="password" required v-model="password"><br><br><br>

        <input type="button" :disabled="!validForm" value="Create" @click="signUp">
      </form>
    </div>
    <div>
      <p>{{ errorMsg }}</p>
    </div>
  </div>
</template>


<style scoped>

</style>