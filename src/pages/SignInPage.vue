<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { signIn } from "../services/firebase_auth.js";


const router = useRouter();

const email = ref("");
const password = ref("");
const validForm = computed(() => email.value.trim() && password.value);
const errorMsg = ref("");


const signInToAccount = async () => {
   console.log(`SignInPage.signIn() -> User attempts to sign in...`);

   try {
		await signIn(email.value, password.value);

      console.log(`SignInPage.signIn() -> User successfully signed in to account. Directing to HomePage.`);
      errorMsg.value = "";
      await router.push("/home");
   }
   catch (error) {
      switch (error.code) {
         case "auth/user-disabled":
            errorMsg.value = "Account disabled. Contact admin.";
            break;
         case "auth/invalid-email":
            errorMsg.value = "Invalid email address.";
            break;
         case "auth/user-not-found":
            errorMsg.value = "There's no account with that email address.";
            break;
         case "auth/invalid-credential":
         case "auth/invalid-login-credentials":
         case "auth/wrong-password":
            errorMsg.value = "Incorrect email or password.";
            break;
         default:
            errorMsg.value = "Oops! Something went wrong.";
            break;
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
					class="bg-surface-container-high"
               width="460px"
					rounded="xl"
               style="min-height: 440px; margin: auto"
            >
               <v-card-title>
						<div class="my-10">
							<h1 class="text-h4 text-center">
								Welcome
							</h1>
						</div>
               </v-card-title>
               <v-card-text>
                  <div style="text-align: center">
                     <v-form @keydown.enter="signInToAccount">
                        <v-text-field
									class="mx-7 mb-2"
                           label="Email address"
                           v-model="email"
                           required
									bg-color="surface-container-highest"
									rounded="l"
                        ></v-text-field>
                        <v-text-field
									class="mx-7 mb-2"
                           label="Password"
                           v-model="password"
                           type="password"
                           required
									bg-color="surface-container-highest"
									rounded="l"
                        ></v-text-field>
                        <v-btn
									class="mt-14"
                           width="320px"
									color="primary"
									rounded="xl"
                           :disabled="!validForm"
                           @click="signInToAccount"
                        >
                           Sign In
                        </v-btn>
                     </v-form>
                  </div>
                  <div style="text-align: center; margin: 50px 0 0 0">
                     <p class="text-error font-weight-medium">
								{{ errorMsg }}
							</p>
                  </div>
               </v-card-text>
            </v-card>

            <br><br>

            <v-card
					class="bg-surface-container-high"
               width="460px"
					rounded="xl"
               style="margin: auto"
            >
               <v-card-text style="text-align: center">
                  Don't have an account? <a href="/signup">Sign up!</a>
               </v-card-text>
            </v-card>
         </v-col>
      </v-row>
   </v-container>
</v-app>
</template>


<style scoped>
</style>