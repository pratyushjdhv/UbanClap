export default {
    template: `
        <div class="login-container">
            <div class="login-box">
                <h1 class="login-title">Login</h1>
                <input class="login-input" type="text" v-model="email" placeholder="Email">
                <input class="login-input" type="password" v-model="password" placeholder="Password">
                <button class="login-button" @click='login_user'>Login</button>
            </div>
        </div>
    `,

    data() {
        return {
            email: '',
            password: ''
        }
    },

    methods: {
        async login_user() {
            const res = await fetch(location.origin + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.email,
                    password: this.password
                })
            });

            if (res.ok) {
                console.log('Logged in');
                const data = await res.json()
                console.log(data)

                localStorage.setItem('user', JSON.stringify(data));
                
                this.$store.commit('setUser');
                this.$router.push('/feed');
            } else {
                const data = await res.json();
                console.error('Login failed:', data.message);
            }
        }
    }
}
