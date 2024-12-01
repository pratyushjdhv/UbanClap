export default {
    template: `
        <div>
            <h1>My Bookings</h1>
            <div v-if="isLoading">Loading...</div>
            <div v-else-if="error">{{ error }}</div>
            <div v-else>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="booking in bookings" :key="booking.id">
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
        }
    },
    async mounted() {
        await this.fetchBookings();
    }
}