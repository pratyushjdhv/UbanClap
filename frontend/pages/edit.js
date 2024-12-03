export default {
    props: ['id'],
    template: `
    <div class="edit-service-container">
    <div class="edit-service-box">
        <h1 class="edit-service-title">Edit Service</h1>
        <div v-if="isLoading" class="loading-text">Loading...</div>
        <div v-else-if="error" class="error-text">{{ error }}</div>
        <div v-else>
            <input v-model="service" placeholder="Service" class="form-control mb-3" />
            <input v-model="name" placeholder="Name" class="form-control mb-3" />
            <input v-model="description" placeholder="Description" class="form-control mb-3" />
            <input type="number" v-model="price" placeholder="Price" class="form-control mb-3" />
            <button @click="updateService" class="btn btn-primary">Update Service</button>
        </div>
    </div>
</div>
    `,
    data() {
        return {
            service: '',
            name: '',
            description: '',
            price: '',
            isLoading: false,
            error: null,
        }
    },
    methods: {
        async fetchService() {
            this.isLoading = true;
            this.error = null;

            try {
                const res = await fetch(`${location.origin}/api/service/${this.id}`, {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch service: HTTP ${res.status}`);
                }

                const data = await res.json();
                this.service = data.service;
                this.name = data.name;
                this.description = data.description;
                this.price = data.price;
            } catch (error) {
                console.error('Error fetching service:', error);
                this.error = 'Could not fetch the service. Please try again later.';
            } finally {
                this.isLoading = false;
            }
        },
        async updateService() {
            try {
                const res = await fetch(`${location.origin}/api/service/${this.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token
                    },
                    body: JSON.stringify({
                        service: this.service,
                        name: this.name,
                        description: this.description,
                        price: this.price
                    })
                });

                if (!res.ok) {
                    throw new Error(`Failed to update service: HTTP ${res.status}`);
                }

                alert('Service updated');
                this.$router.push('/feed');
            } catch (error) {
                console.error('Error updating service:', error);
                alert('Could not update the service. Please try again later.');
            }
        }
    },
    async mounted() {
        await this.fetchService();
    }
}