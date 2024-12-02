export default {
    props: ['id'],
    template: `
        <div>
            <h1>Customer Info</h1>
            <div v-if="isLoading">Loading...</div>
            <div v-else-if="error">{{ error }}</div>
            <div v-else>
                <h2>Customer Details:</h2>
                <ul>
                    <li>Name: {{ customer.name }}</li>
                    <li>Email: {{ customer.email }}</li>
                    <li>Phone: {{ customer.phone }}</li>
                    <li>Address: {{ customer.address }}</li>
                    <li>Pincode: {{ customer.pincode }}</li>
                </ul>
                <h2>Booking Requests:</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Employee</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="booking in bookings" :key="booking.id">
                            <td>{{ booking.service.name }}</td>
                            <td>{{ booking.employee.name }}</td>
                            <td>{{ booking.date }}</td>
                            <td>{{ booking.status }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    data() {
        return {
            customer: {},
            bookings: [],
            isLoading: false,
            error: null,
        };
    },
    methods: {
        async fetchCustomerInfo() {
            this.isLoading = true;
            this.error = null;

            try {
                const res = await fetch(`${location.origin}/api/customers/${this.id}`, {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch customer info: HTTP ${res.status}`);
                }

                this.customer = await res.json();
            } catch (error) {
                console.error('Error fetching customer info:', error);
                this.error = 'Could not fetch the customer info. Please try again later.';
            } finally {
                this.isLoading = false;
            }
        },
        async fetchCustomerBookings() {
            this.isLoading = true;
            this.error = null;

            try {
                const res = await fetch(`${location.origin}/api/bookings?customer_id=${this.id}`, {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch customer bookings: HTTP ${res.status}`);
                }

                this.bookings = await res.json();
            } catch (error) {
                console.error('Error fetching customer bookings:', error);
                this.error = 'Could not fetch the customer bookings. Please try again later.';
            } finally {
                this.isLoading = false;
            }
        }
    },
    async mounted() {
        await this.fetchCustomerInfo();
        await this.fetchCustomerBookings();
    }
}