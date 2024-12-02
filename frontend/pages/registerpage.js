export default {
    template: `
    <div class="register-container">
        <div class="register-box">
            <h1 class="register-title">Register</h1>
            <input type="text" v-model="name" class="register-input" placeholder="Name" required>
            <input type="text" v-model="email" class="register-input" placeholder="Email" required>
            <input type="password" v-model="password" class="register-input" placeholder="Password" required>
            <input type="number" v-model="phone" class="register-input" placeholder="Phone" required>
            <input type="text" v-model="address" class="register-input" placeholder="Address" required>
            <input type="text" v-model="pincode" class="register-input" placeholder="Pincode" required>
            <select v-model="role" class="register-input">
                <option value="customer">Customer</option>
                <option value="emp">Employee</option>
            </select>
            <button @click='register_user' class="register-button">Register</button>
        </div>
    </div>
    `,

    data() {
        return {
            name: '',
            email: '',
            password: '',
            phone: '',
            address: '',
            pincode: '',
            role: '',
        }
    },

    methods: {
        async register_user() {
            try {
                const res = await fetch(location.origin + '/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: this.name,
                        email: this.email,
                        password: this.password,
                        phone: this.phone,
                        address: this.address,
                        pincode: this.pincode,
                        role: this.role
                    })
                });

                if (res.ok) {
                    console.log('Registered');
                    alert('Registration successful');
                    this.$router.push('/login');

                } else {
                    const data = await res.json();
                    console.log(data);
                    alert('Registration failed: ' + data.message);
                }
            } catch (error) {
                console.error('Error during registration:', error);
                alert('An error occurred during registration. Please try again later.');
            }
        }
    }
}