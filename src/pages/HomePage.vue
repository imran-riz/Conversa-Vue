<script setup>
import { useRouter } from "vue-router";
import { signOutUser } from "../libs/chatapp_firebase.js";


const router = useRouter();


const signOutOfAccount = () => {
  console.log("HomePage.signOutOfAccount -> signing out...");

  if (signOutUser()) {
    console.log("HomePage.signOutOfAccount -> User signed out successfully.");
    router.push("/");
  }
  else {
    console.error(`HomePage.signOutOfAccount -> Failed to sign out of account.`);
  }
}
</script>

<template>
  <div>
    <div>
      <h1>Home</h1>
    </div>
    <div>
      <button @click="signOutOfAccount">Sign Out</button>
    </div>

  </div>
</template>

<style scoped>

</style>