<script setup>
import { computed, ref } from "vue";
import { addNewUserAuth } from "../services/firebase_auth.js";
import { addNewUser} from "../services/firebase_firestore.js";


const usernameHint = "Should contain only alphanumeric characters and underscores.";

const firstName = ref("");
const lastName = ref("");
const username = ref("");
const birthdate = ref(null);
const email = ref("");
const password = ref("");
const errorMsg = ref("");
const validForm = computed(() => firstName.value.trim() && lastName.value.trim() && birthdate.value && email.value.trim() && password.value);

const nameRules = [
   value => !!value || 'This field is required',
   
]

const signUp = async () => {
   if (!validForm.value) return;

   console.log(`SignUpPage.signUp() -> creating a new account...`);
   console.log(`Values: ${email.value} | ${firstName.value} | ${lastName.value} | ${username.value} | ${birthdate.value}`);

   try {
      // first add a new auth
      await addNewUserAuth(email.value, password.value);
      console.log("SignUpPage.signUp() -> Auth added successfully.  Creating a user doc on Firestore...");

      // then, add a new document to the user collection
      await addNewUser(email.value, firstName.value, lastName.value, username.value, birthdate.value);
      errorMsg.value = "";
      console.log("SignUpPage.signUp() -> Document for new user created. Account creation successful!");

      alert("Account created!");
   }
   catch (error) {
      console.error(`SignUpPage.signUp() -> Error during account creation:`);
      console.error(error);

      errorMsg.value = "Oops! Something went wrong.";

      if (error.code === "auth/email-already-in-use") {
         errorMsg.value = "That email address is in use. Try another.";
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
               style="min-height: 500px; margin: auto"
            >
               <v-card-title>
						<div class="my-10">
							<h1 class="text-h4 text-center">
								Sign up
							</h1>
						</div>
               </v-card-title>
               <v-card-text>
                  <v-form @keydown.enter="signUp">
                     <v-text-field
                        class="mx-7 mb-2"
                        label="First name"
                        v-model="firstName"
                        required
								bg-color="surface-container-highest"
                     ></v-text-field>
                     <v-text-field
                        class="mx-7 mb-2"
                        label="Last name"
                        v-model="lastName"
                        required
								bg-color="surface-container-highest"
                     ></v-text-field>
                     <v-text-field
								class="mx-7 mb-2"
                        label="Date of birth"
                        v-model="birthdate"
                        type="date"
                        required
								bg-color="surface-container-highest"
                        style="margin: 0 20px 0 20px;"
                     ></v-text-field>
                     <v-text-field
								class="mx-7 mb-2"
                        label="Email address"
                        v-model="email"
                        type="email"
                        required
								bg-color="surface-container-highest"
                     ></v-text-field>
							<v-text-field
								class="mx-7 mb-2"
								label="Username"
								v-model="username"
								required
								:hint="usernameHint"
							></v-text-field>
                     <v-text-field
								class="mx-7 mb-2"
                        label="Password"
                        v-model="password"
                        required
								bg-color="surface-container-highest"
                        type="password"
                     ></v-text-field>
                     <div class="text-center">
                        <p class="text-error font-weight-medium" :hidden="!errorMsg">
									{{ errorMsg }}
								</p>
								<v-btn
									class="my-12"
									width="320px"
									color="primary"
									rounded="xl"
									:disabled="!validForm"
									@click="signUp"
								>
									Let's go!
								</v-btn>
                     </div>
                  </v-form>
               </v-card-text>
            </v-card>
         </v-col>
      </v-row>
   </v-container>
</v-app>
</template>


<style scoped>
</style>