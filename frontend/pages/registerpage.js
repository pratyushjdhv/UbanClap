export default {
    template:`
        <div>
            <h1>Register</h1>
            <input type="text" v-model="name" placeholder="Name">
            <input type="text" v-model="email" placeholder="Email">
            <input type="password" v-model="password" placeholder="Password">
            <input type="text" v-model="phone" placeholder="Phone">
            <input type="text" v-model="address" placeholder="Address">
            <select v-model="role">
                <option value="customer">customer</option>
                <option value="emp">employee</option>
            </select>
            <button @click='register_user'>Register</button>
        </div>
    `,

    data(){
        return{
            name:'',
            email:'',
            password:'',
            phone:'',
            address:'',
            pincode:'',
            role :'',
        }
    },

    methods:{
        async register_user(){
            const res = await fetch(location.origin + '/register',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    name:this.name,
                    email:this.email,
                    password:this.password,
                    phone:this.phone,
                    address:this.address,
                    pincode:this.pincode,
                    role:this.role
                })
            });

            if(res.ok){
                console.log('Registered');
                this.$router.push('/login');
            }
        }
    }
}