<script setup>
import { computed, ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();

// refs used
const email = ref("");
const password = ref("");
const validForm = computed(() => email.value.trim() && password.value);
const errorMsg = ref("");


const signIn = async () => {
  console.log(`SignInPage.signIn() -> User attempts to sign in...`);

  try {
    const userCredentials = await signInWithEmailAndPassword(getAuth(), email.value.trim(), password.value);
    console.log(`SignInPage.signIn() -> User successfully signed in to account. Directing to HomePage.`);

    errorMsg.value = "";

    // direct user to HomePage
    await router.push("/home");
  }
  catch (error) {
    console.error(`SignInPage.signIn() -> Error during user sign in: ${error.code}`);

    if (error.code === "auth/user-disabled") {
      errorMsg.value = "Account disabled. Contact admin.";
    }
    else if (error.code === "auth/invalid-email" || error.code === "auth/user-not-found" || error.code === "auth/invalid-login-credentials" || error.code === "auth/wrong-password") {
      errorMsg.value = "Incorrect email or password.";
    }
    else {
      errorMsg.value = "Oops! Something went wrong.";
    }
  }
}
</script>


<template>
  <div>
    <h1>Sign In</h1>
    <div>
      <form @keydown.enter="signIn">
        <label for="email address">Email address</label><br>
        <input type="email" required placeholder="maybe...elon@musk.com" v-model="email"><br><br>

        <label for="password">Password</label><br>
        <input type="password" required v-model="password"><br><br><br>

        <input type="button" :disabled="!validForm" value="Sign In" @click="signIn">
      </form>
    </div>
    <div>
      <p>{{ errorMsg }}</p>
    </div>
  </div>
</template>


<style scoped>

</style>