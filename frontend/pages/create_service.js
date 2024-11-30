export default {
    template:`
        <div>
            <h1>Create Service</h1>
            <input v-model="service" placeholder="Service" class="form-control mb-3"> 
            <input v-model="name" placeholder="Name" class="form-control mb-3"> 
            <input v-model="description" placeholder="Description" class="form-control mb-3">
            <input type="number" v-model="price" placeholder="Price" class="form-control mb-3">
            <button @click="create_service" class="btn btn-primary">Create Service</button>          
        </div>    
    `,

    data() {
        return {
            service: '',
            name: '',
            description: '',
            price: '',            
        }
    },

    methods: {
        async create_service() {
            // Validate that all fields are present
            if (!this.service || !this.name || !this.description || !this.price) {
                alert('All fields are required');
                return;
            }

            try {
                const res = await fetch(location.origin + '/api/services', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token // Include the authentication token
                    },
                    body: JSON.stringify({
                        service: this.service,
                        name: this.name,
                        description: this.description,
                        price: this.price,
                    })
                });
                if (res.ok) {
                    alert('Service created');
                    this.$router.push('/feed');
                } else {
                    const data = await res.json();
                    alert('Service not created: ' + data.message);
                }
            } catch (error) {
                console.error('Error creating service:', error);
                alert('Service not created: ' + error.message);
            }
        }
    },
}