<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { signIn } from "../services/firebase_auth.js";

const router = useRouter();

// refs used
const email = ref("");
const password = ref("");
const validForm = computed(() => email.value.trim() && password.value);
const errorMsg = ref("");


const signInToAccount = async () => {
  console.log(`SignInPage.signIn() -> User attempts to sign in...`);

  try {
    const userCredentials = await signIn(email.value, password.value);

    console.log(`SignInPage.signIn() -> User successfully signed in to account. Directing to HomePage.`);
    errorMsg.value = "";

    // direct user to HomePage
    await router.push("/home");
  }
  catch (error) {
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
  <v-app>
    <v-container fluid fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-card
              width="400px"
              variant="outlined"
              style="min-height: 500px; margin: auto"
          >
            <v-card-title>
              <div style="margin: 40px 0 60px 0; text-align: center">Welcome</div>
            </v-card-title>
            <v-card-text>
              <div style="text-align: center">
                <v-form @keydown.enter="signInToAccount">
                  <v-text-field
                      label="Email address"
                      v-model="email"
                      required
                      style="margin: 0 20px 0 20px"
                  ></v-text-field>
                  <v-text-field
                      label="Password"
                      v-model="password"
                      type="password"
                      required
                      style="margin: 0 20px 0 20px"
                  ></v-text-field>
                  <v-btn
                      width="320px"
                      :disabled="!validForm"
                      @click="signInToAccount"
                      style="margin: 40px 0 0 0"
                  >
                    Sign In
                  </v-btn>
                </v-form>
              </div>
<!--              <div style="margin: 60px 0 0 0; text-align: center; ">-->
<!--                <span>Don't have an account? Sign up!</span>-->
<!--              </div>-->
              <div style="text-align: center; margin: 50px 0 0 0">
                <p>{{ errorMsg }}</p>
              </div>
            </v-card-text>
          </v-card>
          <br><br>
          <v-card
              width="400px"
              variant="outlined"
              style="margin: auto"
          >
            <v-card-text
              style="text-align: center"
            >
              Don't have an account? Sign up!
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>

<!--  <div>-->
<!--    <h1>Welcome</h1>-->
<!--    <div>-->
<!--      <form @keydown.enter="signInToAccount">-->
<!--        <label for="email address">Email address</label><br>-->
<!--        <input type="email" required placeholder="maybe...elon@musk.com" v-model="email"><br><br>-->

<!--        <label for="password">Password</label><br>-->
<!--        <input type="password" required v-model="password"><br><br><br>-->

<!--        <input type="button" :disabled="!validForm" value="Sign In" @click="signInToAccount">-->
<!--      </form>-->
<!--    </div>-->
<!--    <div>-->
<!--      <p>{{ errorMsg }}</p>-->
<!--    </div>-->
<!--  </div>-->
</template>


<style scoped>

</style>