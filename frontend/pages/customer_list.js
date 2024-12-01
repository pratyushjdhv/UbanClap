export default {
    template: `
        <div>
            <h1>Users List</h1>
            <div class="mb-3">
                <label for="roleFilter">Filter by role:</label>
                <select id="roleFilter" v-model="selectedRole" @change="fetchCustomers" class="form-control">
                    <option value="">All</option>
                    <option value="customer">Customer</option>
                    <option value="emp">Employee</option>
                </select>
            </div>
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
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="customer in filteredCustomers" :key="customer.id">
                            <td>{{ customer.name }}</td>
                            <td>{{ customer.email }}</td>
                            <td>{{ customer.phone }}</td>
                            <td>{{ customer.address }}</td>
                            <td>{{ customer.pincode }}</td>
                            <td>{{ customer.roles[0].name }}</td>
                            <td>
                                <button v-if="customer.active" @click="updateCustomerStatus(customer.id, false)" class="btn btn-danger">Ban</button>
                                <button v-else @click="updateCustomerStatus(customer.id, true)" class="btn btn-success">Unban</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    data() {
        return {
            customers: [],
            selectedRole: '',
            isLoading: false,
            error: null,
        };
    },
    computed: {
        filteredCustomers() {
            if (this.selectedRole) {
                return this.customers.filter(customer => customer.roles[0].name === this.selectedRole);
            }
            return this.customers;
        }
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
        },
        async updateCustomerStatus(id, active) {
            try {
                const res = await fetch(`${location.origin}/api/customers/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token
                    },
                    body: JSON.stringify({ active })
                });

                if (!res.ok) {
                    throw new Error(`Failed to update customer status: HTTP ${res.status}`);
                }

                alert('Customer status updated');
                this.fetchCustomers(); // Refresh the customer list
            } catch (error) {
                console.error('Error updating customer status:', error);
                alert('Could not update the customer status. Please try again later.');
            }
        }
    },
    async mounted() {
        await this.fetchCustomers();
    }
}