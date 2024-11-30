import Navbar from "./components/Navbar.js";
import router from "./utils/router.js";

const app = new Vue({
    el: '#app',
    template: `
        <div> 
            <h2> <Navbar /> </h2>
            
            <router-view> </router-view>
        </div>
    `,
    components: {
        Navbar,
    },
    router,
})