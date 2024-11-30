const Home = {
    template : `<h1> this is home </h1>`
}

import loginpage from "../pages/loginpage.js"
import registerpage from "../pages/registerpage.js"    

const routes = [

    {path : '/', component : Home},
    {path : '/login', component : loginpage},
    {path : '/register', component : registerpage}

]

const router = new VueRouter({
    routes
})

export default router;