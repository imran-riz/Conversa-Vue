<script setup>
import { reactive, ref } from "vue";
import { addNewUserAuth } from "../services/firebase_auth.js";
import { addNewUser} from "../services/firebase_firestore.js";
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers, minLength } from "@vuelidate/validators";


const state = reactive({
	firstName: "",
	lastName: "",
	username: "",
	birthdate: null,
	emailAddress: "",
	password: "",
});

const alphaNumWithUnderscores = helpers.regex(/^[a-zA-Z0-9_]+$/);

const validationRules = {
	firstName: {
		required: helpers.withMessage("First name is required.", required),
	},
	lastName: {
		required: helpers.withMessage("Last name is required.", required),
	},
	username: {
		required: helpers.withMessage("Username is required.", required),
		minLength: helpers.withMessage("Should be at least 3 characters long.", minLength(3)),
		alphaNumWithUnderscores: helpers.withMessage("Should contain only alphanumeric characters and underscores.", alphaNumWithUnderscores),
	},
	birthdate: {
		required: helpers.withMessage("Date of birth is required.", required),
	},
	emailAddress: {
		required: helpers.withMessage("Email address is required.", required),
		email: helpers.withMessage("Invalid email address.", email),
	},
	password: {
		required: helpers.withMessage("Password is required.", required),
		minLength: helpers.withMessage("Should be at least 6 characters long.", minLength(6)),
	},
};

const v$ = useVuelidate(validationRules, state);

const form = ref(null);
const errorMsg = ref("");
const showSnackbar = ref(false);


const signUp = async () => {

   console.log(`SignUpPage.signUp() -> creating a new account...`);

	const result = await v$.value.$validate();

	if (!result) return;

   console.log(`Values: ${state.emailAddress} | ${state.firstName} | ${state.lastName} | ${state.username} | ${state.birthdate}`);

   try {
      await addNewUserAuth(state.emailAddress.trim(), state.password);
      await addNewUser(state.emailAddress.trim(), state.firstName.trim(), state.lastName.trim(), state.username.toLowerCase().trim(), state.birthdate);

      errorMsg.value = "";
      console.log("SignUpPage.signUp() -> Document for new user created. Account creation successful!");

		showSnackbar.value = true;

		// form.value.reset();
   }
   catch (error) {
      console.error(`SignUpPage.signUp() -> Error during account creation:`);
      console.error(error);

      errorMsg.value = "Oops! Something went wrong.";

      if (error.code === "auth/email-already-in-use") {
         errorMsg.value = "Looks like we got that email address already. Try another.";
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
                  <v-form ref="form" @keydown.enter.prevent="signUp">
                     <v-text-field
                        class="mx-7 mb-2"
                        label="First name"
                        v-model="state.firstName"
								:error-messages="v$.firstName.$errors.map(e => e.$message)"
                        required
								bg-color="surface-container-highest"
                     ></v-text-field>
                     <v-text-field
                        class="mx-7 mb-2"
                        label="Last name"
                        v-model="state.lastName"
								:error-messages="v$.lastName.$errors.map(e => e.$message)"
                        required
								bg-color="surface-container-highest"
                     ></v-text-field>
                     <v-text-field
								class="mx-7 mb-2"
                        label="Date of birth"
                        v-model="state.birthdate"
								:error-messages="v$.birthdate.$errors.map(e => e.$message)"
                        type="date"
                        required
								bg-color="surface-container-highest"
                        style="margin: 0 20px 0 20px;"
                     ></v-text-field>
                     <v-text-field
								class="mx-7 mb-2"
                        label="Email address"
                        v-model="state.emailAddress"
								:error-messages="v$.emailAddress.$errors.map(e => e.$message)"
                        type="email"
                        required
								bg-color="surface-container-highest"
                     ></v-text-field>
							<v-text-field
								class="mx-7 mb-2"
								label="Username"
								v-model="state.username"
								:error-messages="v$.username.$errors.map(e => e.$message)"
								required
								:hint="'Should contain only alphanumeric characters and underscores.'"
							></v-text-field>
                     <v-text-field
								class="mx-7 mb-2"
                        label="Password"
                        v-model="state.password"
								:error-messages="v$.password.$errors.map(e => e.$message)"
                        required
								bg-color="surface-container-highest"
                        type="password"
                     ></v-text-field>
                     <div class="text-center">
                        <p class="text-body-2 text-error font-weight-medium"
									:hidden="!errorMsg"
								>
									{{ errorMsg }}
								</p>
								<v-btn
									class="my-12 text-none"
									width="320px"
									color="primary"
									rounded="xl"
									@click="signUp"
								>
									Let's go!
								</v-btn>
                     </div>
                  </v-form>
               </v-card-text>
					<v-snackbar
						v-model="showSnackbar"
						color="success"
						timeout="3000"
					>User created successfully!
						<template v-slot:actions>
							<v-btn
								class="text-none"
								variant="text"
								@click="showSnackbar = false"
							>
								Close
							</v-btn>
						</template>
					</v-snackbar>
            </v-card>
         </v-col>
      </v-row>
   </v-container>
</v-app>
</template>


<style scoped>
</style>