export default {
    template: `
        <div>
            <h1>Login</h1>
            <input type="text" v-model="email" placeholder="Email">
            <input type="password" v-model="password" placeholder="Password">
            <button @click='login_user'>Login</button>
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
                // this.$router.push('/feed');
            }
        }
    }
}