export default {
    template: `
    <div class="navbar-container">
    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container-fluid">
            <!-- Navbar Brand -->
            <router-link class="navbar-brand" to="/">
                <span class="bi bi-boxes h1" style="color: var(--primary-color)">UrbanClap</span>
            </router-link>

            <!-- Navbar Toggler (for mobile) -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Navbar Links -->
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <!-- Welcome Message -->
                    <li class="nav-item">
                        <p v-if="$store.state.loggedIn" class="navbar-text">Welcome {{$store.state.username}}!!</p>
                        <p v-if="!$store.state.loggedIn" class="navbar-text">Welcome User!!</p>
                    </li>

                    <!-- Conditional Links based on login state and user role -->
                    <li class="nav-item" v-if="$store.state.loggedIn">
                        <router-link class="nav-link" exact-active-class="active" to="/feed">Feed</router-link>
                    </li>
                    <li class="nav-item" v-if="!$store.state.loggedIn">
                        <router-link class="nav-link" exact-active-class="active" to="/login">Login</router-link>
                    </li>
                    <li class="nav-item" v-if="!$store.state.loggedIn">
                        <router-link class="nav-link" exact-active-class="active" to="/register">Register</router-link>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn && $store.state.role === 'emp'">
                        <router-link class="nav-link" exact-active-class="active" to="/create-service">Create Service</router-link>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn && $store.state.role === 'emp'">
                        <router-link class="nav-link" exact-active-class="active" to="/manage-bookings">Manage Bookings</router-link>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn && $store.state.role === 'admin'">
                        <router-link class="nav-link" exact-active-class="active" to="/admin-dashboard">Admin Dashboard</router-link>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn && $store.state.role === 'customer'">
                        <router-link class="nav-link" exact-active-class="active" to="/my-bookings">My Bookings</router-link>
                    </li>
                </ul>
                <!-- Logout Button -->
                <button class="btn btn-secondary" v-if="$store.state.loggedIn" @click="logout">Logout</button>
            </div>
        </div>
    </nav>
</div>

    `,
    methods: {
        logout() {
            this.$store.commit("logout");
            this.$router.push("/login");
        },
    },
};
