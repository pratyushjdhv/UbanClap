export default {
    props: ['id'],
    template: `
    <div class="customer-info-container">
    <h1 class="customer-info-title">Customer Details:</h1>
    <div v-if="isLoading" class="loading-text">Loading...</div>
    <div v-else-if="error" class="error-text">{{ error }}</div>
    <div v-else>
        <div class="customer-details-box">
            <ul>
                <li><strong>Name:</strong> {{ customer.name }}</li>
                <li><strong>Email:</strong> {{ customer.email }}</li>
                <li><strong>Phone:</strong> {{ customer.phone }}</li>
                <li><strong>Address:</strong> {{ customer.address }}</li>
                <li><strong>Pincode:</strong> {{ customer.pincode }}</li>
            </ul>
        </div>

        <h2 class="booking-title">Booking Requests:</h2>

        <div class="mb-3">
            <label for="statusFilter" class="form-label">Filter by status:</label>
            <select id="statusFilter" v-model="selectedStatus" @change="filterBookings" class="form-control">
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Rejected">Rejected</option>
                <option value="Completed">Completed</option>
            </select>
        </div>

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
                <tr v-for="booking in filteredBookings" :key="booking.id">
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
            filteredBookings: [],
            selectedStatus: '',
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
                this.filteredBookings = this.bookings; // Initialize filteredBookings
            } catch (error) {
                console.error('Error fetching customer bookings:', error);
                this.error = 'Could not fetch the customer bookings. Please try again later.';
            } finally {
                this.isLoading = false;
            }
        },
        filterBookings() {
            if (this.selectedStatus) {
                this.filteredBookings = this.bookings.filter(booking => booking.status === this.selectedStatus);
            } else {
                this.filteredBookings = this.bookings;
            }
        }
    },
    async mounted() {
        await this.fetchCustomerInfo();
        await this.fetchCustomerBookings();
    }
}