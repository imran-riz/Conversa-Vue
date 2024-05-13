import { createRouter, createWebHistory } from "vue-router";
import { getCurrentUserAuth } from "../services/firebase_auth.js";

const router = createRouter({
   history: createWebHistory(),
   routes: [
      {
         path: "/",
         name: "Sign In",
         component: () => import("../pages/SignInPage.vue"),
      },
      {
         path: "/signup",
         name: "Sign Up",
         component: () => import("../pages/SignUpPage.vue"),
      },
      {
         path: "/home",
         name: "Home",
         component: () => import("../pages/HomePage.vue"),
         meta: {
            requiresAuth: true
         },
      },
   ],
});

// before navigating to a route, check if it requires authentication
router.beforeEach(async (to, from, next) => {
   console.log(`router/index.js -> Trying to go to ${to.fullPath} from ${from.fullPath}`);

   if (to.matched.some((record) => record.meta.requiresAuth)) {
      console.log("router/index.js -> Requires auth...");

      const user = await getCurrentUserAuth();

      console.log(`user is: `);
      console.log(user);

      if (user) {
         console.log(`router/index.js -> User signed in: ${user.email}. Going to page: ${to.path}`);
         next();
      } else {
         console.log("router/index.js -> Not signed in, so no access. Directing to SignInPage");
         next("/");
      }
   }
   else {
      console.log("router/index.js -> Auth not requitred. Going to page.");
      next();
   }
});


export default router;