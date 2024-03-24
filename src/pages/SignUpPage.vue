<script setup>
import {computed, ref} from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {addNewUser, getFirestoreDatabase} from "../libs/chatapp_firebase.js";


const firstNameRef = ref("");
const lastNameRef = ref("");
const birthdateRef = ref(null);
const emailRef = ref("");
const passwordRef = ref("");
const validFormRef = computed(() => firstNameRef.value.trim() && lastNameRef.value.trim() && birthdateRef.value && emailRef.value.trim() && passwordRef.value);
const errorMsgRef = ref("");

const signUp = async () => {
  if (!validFormRef.value) return;

  console.log(`SignUpPage.vue: signUp() -> creating an account with details: \n ${firstNameRef.value} \n ${lastNameRef.value} \n ${birthdateRef.value}`);
  const auth = getAuth();

  try {
    const userCredentials = await createUserWithEmailAndPassword(auth, emailRef.value.trim(), passwordRef.value);

    console.log("SignUpPage.signUp() -> Auth added successfully.");


    console.log("SignUpPage.signUp() -> Creating document on Firestore...");

    // add a new document to the user collection
    await addNewUser(emailRef.value, firstNameRef.value, lastNameRef.value, birthdateRef.value);

    console.log("SignUpPage.signUp() -> Document for new user created.");

    errorMsgRef.value = "";
  }
  catch (error) {
    console.error(`SignUpPage.signUp() -> Error during account creation: ${error.code}`);

    errorMsgRef.value = "Oops! Something went wrong.";

    if (error.code === "auth/email-already-in-use") {
      errorMsgRef.value = "That email address is already in use. Try another :)";
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
        <input type="text" required v-model="firstNameRef"><br><br>

        <label for="last name">Last name</label><br>
        <input type="text" required v-model="lastNameRef"><br><br>

        <label for="first name">Birthdate</label><br>
        <input type="date" required v-model="birthdateRef"><br><br>

        <label for="first name">Email address</label><br>
        <input type="email" required placeholder="maybe...elon@musk.com" v-model="emailRef"><br><br>

        <label for="first name">Password</label><br>
        <input type="password" required v-model="passwordRef"><br><br><br>

        <input type="button" :disabled="!validFormRef" value="Create" @click="signUp">
      </form>
    </div>
    <div>
      <p>{{ errorMsgRef }}</p>
    </div>
  </div>
</template>


<style scoped>

</style>