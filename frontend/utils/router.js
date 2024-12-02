import store from "./store.js";
import loginpage from "../pages/loginpage.js";
import registerpage from "../pages/registerpage.js";
import admin from "../pages/admin.js";
import service from "../pages/service.js";
import service_list from "../pages/service_list.js";
import create_service from "../pages/create_service.js";
import booking_management from "../pages/booking_management.js";
import customer_list from "../pages/customer_list.js";
import UserBookings from "../pages/UserBookings.js";
import admin_bookings from "../pages/admin_bookings.js";
import customer_info from "../pages/customer_info.js";
import home from "../pages/home.js";
import edit_service from "../pages/edit.js"; // Import the edit service component

const routes = [
    { path: '/', component: home },
    { path: '/login', component: loginpage },
    { path: '/register', component: registerpage },
    { path: '/feed', component: service_list, meta: { requiresLogin: true } },
    { path: '/admin-dashboard', component: admin, meta: { requiresAuth: true, role: "admin" } },
    { path: '/service/:id', component: service, props: true, meta: { requiresAuth: true } },
    { path: '/create-service', component: create_service, meta: { requiresAuth: true } },
    { path: '/manage-bookings', component: booking_management, meta: { requiresAuth: true, role: "emp" } },
    { path: '/customer-list', component: customer_list, meta: { requiresAuth: true, role: "admin" } },
    { path: '/my-bookings', component: UserBookings, meta: { requiresAuth: true, role: "customer" } },
    { path: '/admin-bookings', component: admin_bookings, meta: { requiresAuth: true, role: "admin" } },
    { path: '/customer-info/:id', component: customer_info, props: true, meta: { requiresAuth: true, role: "admin" } },
    { path: '/edit-service/:id', component: edit_service, props: true, meta: { requiresAuth: true } } // Add the edit service route
];

const router = new VueRouter({
    routes
});

// navigation guards
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth || record.meta.requiresLogin)) {
        if (!store.state.loggedIn) {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            });
        } else if (to.meta.role && to.meta.role !== store.state.role) {
            alert('Role not authorized');
            next({ path: '/' });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;