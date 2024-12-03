export default {
    template: `
    <div class="booking-management-container">
    <div class="booking-management-box">
        <h1 class="booking-management-title">Booking Management</h1>
        <div class="mb-4">
            <label for="statusFilter" class="form-label">Filter by Status:</label>
            <select id="statusFilter" v-model="selectedStatus" @change="fetchBookings" class="form-control">
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Rejected">Rejected</option>
                <option value="Completed">Completed</option>
                <option value="Expired">Expired</option>
            </select>
        </div>
        <div v-if="isLoading" class="loading-text">Loading...</div>
        <div v-else-if="error" class="error-text">{{ error }}</div>
        <div v-else>
            <table class="table booking-table">
                <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Customer Email</th>
                        <th>Customer Phone</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
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
                        <td>
                            <button v-if="booking.status === 'Pending'" @click="updateBookingStatus(booking.id, 'Confirmed')" class="btn btn-success btn-action">Confirm</button>
                            <button v-if="booking.status === 'Pending'" @click="updateBookingStatus(booking.id, 'Rejected')" class="btn btn-danger btn-action">Reject</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
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
        },
        async updateBookingStatus(id, status) {
            try {
                const res = await fetch(`${location.origin}/api/bookings/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token
                    },
                    body: JSON.stringify({ status })
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || `Failed to update booking status: HTTP ${res.status}`);
                }

                alert('Booking status updated');
                this.fetchBookings(); // Refresh the booking list
            } catch (error) {
                console.error('Error updating booking status:', error);
                alert(error.message || 'Could not update the booking status. Please try again later.');
            }
        }
    },
    async mounted() {
        await this.fetchBookings();
    }
}