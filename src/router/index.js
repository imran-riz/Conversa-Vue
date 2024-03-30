import { createRouter, createWebHistory } from "vue-router";
import { getCurrentUser } from "../libs/chatapp_firebase.js";

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

        const user = await getCurrentUser();

        if (user) {
            console.log(`router/index.js -> User signed in: ${user.email}. Going to page: ${to.path}`);
            next();
        } else {
            console.log("router/index.js -> Not signed in, so no access. Directing to SignInPage");
            next("/");
        }
    }
    else {
        next();
    }
});


export default router;