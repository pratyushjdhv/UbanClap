import Navbar from "./components/Navbar.js";
import router from "./utils/router.js";
import store from "./utils/store.js";

const app = new Vue({
    el: '#app',
    template: `
        <div> 
            <h3>welcome {{$store.state.username}}</h3>
            <h2> <Navbar /> </h2>
            
            <router-view> </router-view>
        </div>
    `,
    components: {
        Navbar,
    },
    router,
    store,
})