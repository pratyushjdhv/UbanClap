export default {
    template: `
        <div>
            <h1>Booking Management</h1>
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="booking in bookings" :key="booking.id">
                            <td>{{ booking.customer.name }}</td>
                            <td>{{ booking.customer.email }}</td>
                            <td>{{ booking.customer.phone }}</td>
                            <td>{{ booking.service.name }}</td>
                            <td>{{ booking.date }}</td>
                            <td>{{ booking.status }}</td>
                            <td>
                                <button v-if="booking.status === 'Pending'" @click="updateBookingStatus(booking.id, 'Confirmed')" class="btn btn-success">Confirm</button>
                                <button v-if="booking.status === 'Confirmed'" @click="updateBookingStatus(booking.id, 'Completed')" class="btn btn-primary">Complete</button>
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
                this.fetchBookings(); // Refresh the booking list
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