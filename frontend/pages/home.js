export default {
    template: `
        <div>
            <h1>Home</h1>
            <p>Welcome to the home page</p>
            <div v-if="$store.state.role === 'emp'">
                <h2>Summary of Ratings Received</h2>
                <p v-if="isLoading">Loading...</p>
                <p v-else-if="error">{{ error }}</p>
                <div v-else>
                    <p>Total Ratings: {{ totalRatings }}</p>
                    <p>Average Rating: {{ averageRating.toFixed(2) }}</p>
                </div>
                <h2>Booking Status</h2>
                <div class="container">
                    <canvas id="bookingStatusChart" width= '360' height='360'></canvas>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            totalRatings: 0,
            averageRating: 0,
            isLoading: false,
            error: null,
            bookings: []
        };
    },
    methods: {
        async fetchRatingsSummary() {
            this.isLoading = true;
            this.error = null;

            try {
                const res = await fetch(`${location.origin}/api/ratings-summary`, {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch ratings summary: HTTP ${res.status}`);
                }

                const data = await res.json();
                this.totalRatings = data.totalRatings;
                this.averageRating = data.averageRating;
            } catch (error) {
                console.error('Error fetching ratings summary:', error);
                this.error = 'Could not fetch the ratings summary. Please try again later.';
            } finally {
                this.isLoading = false;
            }
        },
        async fetchBookingData() {
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
                this.renderChart();
            } catch (error) {
                console.error('Error fetching bookings:', error);
                this.error = 'Could not fetch the bookings. Please try again later.';
            } finally {
                this.isLoading = false;
            }
        },
        renderChart() {
            const statusCounts = this.bookings.reduce((acc, booking) => {
                acc[booking.status] = (acc[booking.status] || 0) + 1;
                return acc;
            }, {});

            const data = {
                labels: Object.keys(statusCounts),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF'],
                }]
            };

            const ctx = document.getElementById('bookingStatusChart').getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Bookings by Status'
                        }
                    }
                }
            });
        }
    },
    async mounted() {
        if (this.$store.state.role === 'emp') {
            await this.fetchRatingsSummary();
            await this.fetchBookingData();
        }
    }
}