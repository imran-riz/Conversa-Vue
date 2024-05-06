<script setup>
import { computed, ref } from "vue";
import { addNewUserAuth } from "../services/firebase_auth.js";
import { addNewUser} from "../services/firebase_firestore.js";


const firstName = ref("");
const lastName = ref("");
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
   console.log(`Values: ${email.value} | ${firstName.value} | ${lastName.value} | ${birthdate.value}`);

   try {
      // first add a new auth
      await addNewUserAuth(email.value, password.value);
      console.log("SignUpPage.signUp() -> Auth added successfully.  Creating a user doc on Firestore...");

      // then, add a new document to the user collection
      await addNewUser(email.value, firstName.value, lastName.value, birthdate.value);
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
               width="400px"
               variant="outlined"
               style="min-height: 500px; margin: auto"
            >
               <v-card-title>
                  <div style="margin: 40px 0 60px 0; text-align: center">
                     Sign Up
                  </div>
               </v-card-title>
               <v-card-text>
                  <v-form @keydown.enter="signUp" style="text-align: center">
                     <v-text-field
                        class="form-field-container"
                        label="First name"
                        v-model="firstName"
                        required
                     ></v-text-field>
                     <v-text-field
                        class="form-field-container"
                        label="Last name"
                        v-model="lastName"
                        required
                     ></v-text-field>
                     <v-text-field
                        label="Date of birth"
                        v-model="birthdate"
                        type="date"
                        required
                        style="margin: 0 20px 0 20px;"
                     ></v-text-field>
                     <v-text-field
                        label="Email address"
                           class="form-field-container"
                        v-model="email"
                        type="email"
                        required
                     ></v-text-field>
                     <v-text-field
                        label="Password"
                           class="form-field-container"
                        v-model="password"
                        required
                        type="password"
                     ></v-text-field>

                     <div class="error-container form-field-container" :hidden="!errorMsg">
                        <p>{{ errorMsg }}</p>
                     </div>
                     
                     
                     <v-btn
                        width="320px"
                        :disabled="!validForm"
                        @click="signUp"
                        style="margin: 40px 0 50px 0"
                     >
                        Let's go!
                     </v-btn>
                  </v-form>
               </v-card-text>
            </v-card>
         </v-col>
      </v-row>
   </v-container>
</v-app>
</template>


<style scoped>
.form-field-container {
   margin: 0 20px 0 20px;
}
</style>