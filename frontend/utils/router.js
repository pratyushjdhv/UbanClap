const Home = {
    template: `<h1> this is home </h1>`
}
import store from "./store.js";
import loginpage from "../pages/loginpage.js"
import registerpage from "../pages/registerpage.js"
import admin from "../pages/admin.js"
import service from "../pages/service.js"
import service_list from "../pages/service_list.js"
import create_service from "../pages/create_service.js"



const routes = [

    { path: '/', component: Home },
    { path: '/login', component: loginpage },
    { path: '/register', component: registerpage },
    { path: '/feed', component: service_list, meta: { requiresLogin: true } },
    { path: '/admin-dashboard', component: admin, meta: { requiresAuth: true, role: "admin" } },
    { path: '/service/:id', component: service,props: true, meta: { requiresAuth: true } },
    { path: '/create-service', component: create_service, meta: { requiresAuth: true } },
    
]

const router = new VueRouter({
    routes
})

// navigation guards
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.state.loggedIn) {
            next({
                path: '/login',
            })
        } else if (to.meta.role && to.meta.role != store.state.role) {
            alert('role not authorized')
            next({ path: '/' })
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router;