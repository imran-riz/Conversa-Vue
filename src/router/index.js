import { createRouter, createWebHistory } from "vue-router";

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
        },
    ],
});


export default router;