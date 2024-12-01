export default {
    template: `
    <div>
        <router-link to='/'>Home</router-link>
        <router-link v-if="!$store.state.loggedIn" to='/login'>Login</router-link>
        <router-link v-if="!$store.state.loggedIn" to='/register'>Register</router-link>
        <router-link v-if="$store.state.loggedIn && $store.state.role == 'emp'" to='/create-service'>Create Service</router-link>
        <router-link v-if="$store.state.loggedIn && $store.state.role == 'emp'" to='/manage-bookings'>Manage Bookings</router-link>
        <router-link v-if="$store.state.loggedIn && $store.state.role == 'admin'" to='/admin-dashboard'>Admin Dash</router-link>
        <router-link v-if="$store.state.loggedIn && $store.state.role == 'customer'" to='/my-bookings'>My Bookings</router-link>
        <router-link v-if="$store.state.loggedIn" to='/feed'>Feed</router-link>
        <button class="btn btn-secondary" v-if="$store.state.loggedIn" @click="logout">Logout</button>
    </div>
    `,
    methods: {
        logout() {
            this.$store.commit('logout');
            this.$router.push('/login');
        }
    }
}