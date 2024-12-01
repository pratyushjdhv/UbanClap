export default {
    template: `
        <div>
            <h1>Manage Bookings</h1>
            <div v-if="isLoading">Loading...</div>
            <div v-else-if="error">{{ error }}</div>
            <div v-else>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="booking in bookings" :key="booking.id">
                            <td>{{ booking.service.name }}</td>
                            <td>{{ booking.customer.name }}</td>
                            <td>{{ booking.date }}</td>
                            <td>{{ booking.status }}</td>
                            <td>
                                <button @click="updateBookingStatus(booking.id, 'Accepted')" class="btn btn-success">Accept</button>
                                <button @click="updateBookingStatus(booking.id, 'Rejected')" class="btn btn-danger">Reject</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,

    data() {
        return {
            bookings: [],
            isLoading: false,
            error: null,
        };
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
                    throw new Error(`Failed to update booking status: HTTP ${res.status}`);
                }

                alert('Booking status updated');
                this.fetchBookings(); // Refresh the bookings list
            } catch (error) {
                console.error('Error updating booking status:', error);
                alert('Could not update the booking status. Please try again later.');
            }
        }
    },

    async mounted() {
        await this.fetchBookings();
    }
}