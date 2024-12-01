export default {
    template: `
        <div>
            <h1>Customer List</h1>
            <div v-if="isLoading">Loading...</div>
            <div v-else-if="error">{{ error }}</div>
            <div v-else>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Pincode</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="customer in customers" :key="customer.id">
                            <td>{{ customer.name }}</td>
                            <td>{{ customer.email }}</td>
                            <td>{{ customer.phone }}</td>
                            <td>{{ customer.address }}</td>
                            <td>{{ customer.pincode }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    data() {
        return {
            customers: [],
            isLoading: false,
            error: null,
        };
    },
    methods: {
        async fetchCustomers() {
            this.isLoading = true;
            this.error = null;

            try {
                const res = await fetch(`${location.origin}/api/customers`, {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch customers: HTTP ${res.status}`);
                }

                this.customers = await res.json();
            } catch (error) {
                console.error('Error fetching customers:', error);
                this.error = 'Could not fetch the customers. Please try again later.';
            } finally {
                this.isLoading = false;
            }
        }
    },
    async mounted() {
        await this.fetchCustomers();
    }
}