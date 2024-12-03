export default {
    template: `
    <div class="employee-home-container">

    <div v-if="$store.state.role === 'emp'" >
        <div class="container" style="width:700px; height:610px; background-color:var(--secondary); padding-top:25px;  border-radius: 15px;">

            <h2 class="employee-home-title">Summary of Ratings Received</h2>
        
        <p v-if="isLoading" class="loading-text">Loading...</p>
        <p v-else-if="error" class="error-text">{{ error }}</p>
        
        <div v-else>
            <h2>Total Ratings: {{ totalRatings }} <i class="bi bi-star-half text-warning"></i></h2>
            <h3>Average Rating: {{ averageRating.toFixed(2) }} <i class="bi bi-star-half text-warning"></i></h3>
        </div>
        
        <h2 class="employee-home-subtitle">Booking Status</h2>
        <div class="chart-container">
            <canvas id="bookingStatusChart" width='360' height='360'></canvas>
        </div>
        </div>
        
    </div>

    <div v-else>
    <h1>hii</h1>
    <div class="container-fluid" style='width:1000px; height:1000px; background-color:whitesmoke; '>
        <h1>hi</h1>

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