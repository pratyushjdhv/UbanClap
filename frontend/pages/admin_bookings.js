export default {
    template: `
        <div>
            <h1>Booking Requests</h1>
            <div class="mb-3">
                <label for="statusFilter">Filter by status:</label>
                <select id="statusFilter" v-model="selectedStatus" @change="fetchBookings" class="form-control">
                    <option value="">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
            <div v-if="isLoading">Loading...</div>
            <div v-else-if="error">{{ error }}</div>
            <div v-else>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Customer Email</th>
                            <th>Customer Phone</th>
                            <th>Service</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="booking in filteredBookings" :key="booking.id">
                            <td>{{ booking.customer.name }}</td>
                            <td>{{ booking.customer.email }}</td>
                            <td>{{ booking.customer.phone }}</td>
                            <td>{{ booking.service.name }}</td>
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
            bookings: [],
            selectedStatus: '',
            isLoading: false,
            error: null,
        };
    },
    computed: {
        filteredBookings() {
            if (this.selectedStatus) {
                return this.bookings.filter(booking => booking.status === this.selectedStatus);
            }
            return this.bookings;
        }
    },
    methods: {
        async fetchBookings() {
            this.isLoading = true;
            this.error = null;

            try {
                const res = await fetch(`${location.origin}/api/bookings`, {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch bookings: HTTP ${res.status}`);
                }

                this.bookings = await res.json();
            } catch (error) {
                console.error('Error fetching bookings:', error);
                this.error = 'Could not fetch the bookings. Please try again later.';
            } finally {
                this.isLoading = false;
            }
        }
    },
    async mounted() {
        await this.fetchBookings();
    }
}