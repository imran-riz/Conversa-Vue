<!--suppress JSUnresolvedReference -->
<script setup>
import { reactive, ref} from "vue";
import { useRouter } from "vue-router";
import { signIn } from "../services/firebase_auth.js";
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";


const state = reactive({ emailAddress: "", password: "" });
const errorMsg = ref("");

const validationRules = {
	emailAddress: {
		required: helpers.withMessage("Email address is required.", required),
		email: helpers.withMessage("Invalid email address.", email),
	},
	password: {
		required: helpers.withMessage("Password is required.", required),
	},
};
const v$ = useVuelidate(validationRules, state);
const router = useRouter();


const signInToAccount = async () => {
   console.log(`SignInPage.signIn() -> User attempts to sign in...`);

	const result = await v$.value.$validate();

	if (!result) return;

   try {
		await signIn(state.emailAddress, state.password);

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
            errorMsg.value = "Sorry, either your email address or password is incorrect.";
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
									class="mx-7 mb-2 text-left"
									v-model="state.emailAddress"
									:error-messages="v$.emailAddress.$errors.map(e => e.$message)"
                           label="Email address"
                           required
									bg-color="surface-container-highest"
									rounded="l"
                        ></v-text-field>
                        <v-text-field
									class="mx-7 mb-2 text-left"
									v-model="state.password"
									:error-messages="v$.password.$errors.map(e => e.$message)"
                           label="Password"
                           type="password"
                           required
									bg-color="surface-container-highest"
									rounded="l"
                        ></v-text-field>
								<div class="mt-4 mb-8">
									<p class="text-body-2 text-error font-weight-medium">
										{{ errorMsg }}
									</p>
								</div>
                     </v-form>
                  </div>
               </v-card-text>
					<v-card-actions class="pb-10">
						<v-btn
							class="ml-9 text-none"
							width="92px"
							color="primary"
							variant="outlined"
							rounded="xl"
							@click="() => router.push('/signup')"
						>
							Sign Up
						</v-btn>
						<v-divider color="transparent"></v-divider>
						<v-btn
							class="mr-9 text-none"
							width="92px"
							color="primary"
							variant="flat"
							rounded="xl"
							@click="signInToAccount"
						>
							Sign In
						</v-btn>
					</v-card-actions>
            </v-card>
         </v-col>
      </v-row>
   </v-container>
</v-app>
</template>


<style scoped>
</style>