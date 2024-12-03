export default {
    template: `
    <div class="employee-home-container">
    <div v-if="$store.state.role === 'emp'">
        <div class="container" style="width: 700px; height: 610px; background-color: var(--secondary); padding-top: 25px; border-radius: 15px;">
            <h2 class="employee-home-title">Summary of Ratings Received</h2>

            <p v-if="isLoading" class="loading-text">Loading...</p>
            <p v-else-if="error" class="error-text">{{ error }}</p>

            <div v-else>
                <h2>Total Ratings: {{ totalRatings }} <i class="bi bi-star-half text-warning"></i></h2>
                <h3>Average Rating: {{ averageRating.toFixed(2) }} <i class="bi bi-star-half text-warning"></i></h3>
            </div>

            <h2 class="employee-home-subtitle">Booking Status</h2>
            <div class="chart-container">
                <canvas id="bookingStatusChart" width="360" height="360"></canvas>
            </div>
        </div>
    </div>

    <div v-else>
        <div class="home-box container">
            <div class="title-box"><h1 style="color: var(--primary-color);">Services provided by Us</h1></div>
            <div class="container">
                <div class="row">
                    <div class="col">
                        <div class="box-box box1">
                            <img class="custom-img" src="https://i.pinimg.com/736x/91/97/64/9197643d56ea63a30c882d8dd29d94ad.jpg" alt="Massage Service" />
                        </div>
                        <div class="serv-top top1">
                            Massage
                        </div>
                    </div>
                    <div class="col">
                        <div class="box-box box2">
                            <img class="custom-img" src="https://i.pinimg.com/736x/09/89/9b/09899bae2c4c1c7d592bb6ba3492be47.jpg" alt="Haircut Service" />
                        </div>
                        <div class="serv-top top2">
                            AC Repairing
                        </div>
                    </div>

                    <div class="col">
                        <div class="box-box box3">
                            <img class="custom-img" src="https://i.pinimg.com/736x/75/00/4a/75004acc20ab2831e419f44a2fa752ba.jpg" alt="Facial Service" />
                        </div>
                        <div class="serv-top top2">
                            Cleaning service
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="box-box2 box1">
                            <img class="custom-img" src="https://i.pinimg.com/736x/9a/b8/65/9ab8656924b5a99d69292d5c9f221f01.jpg" alt="Manicure Service" />
                        </div>
                        <div class="serv-bot top1">
                            Electrician
                        </div>
                    </div>
                    <div class="col">
                        <div class="box-box2 box2">
                            <img class="custom-img" src="https://i.pinimg.com/736x/87/b1/e9/87b1e9d9c9c582f82cee771740c7dd9b.jpg" alt="Pedicure Service" />
                        </div>
                        <div class="serv-bot bot2">
                            Plumbing
                        </div>
                    </div>

                    <div class="col">
                        <div class="box-box2 box3">
                            <img class="custom-img" src="https://i.pinimg.com/736x/74/00/40/740040f3f6c2ba1a33d1afc4821e2150.jpg" alt="Spa Service" />
                        </div>
                        <div class="serv-bot bot3">
                            Packing/Shifting
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container" style="height: 100%; width: 100%;">
            <img
                src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1696852847761-574450.jpeg"
                style="position: relative; left: 650px; top: 50px; max-width: 40%; height: auto; display: block; object-fit: cover;"
            />
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
                    backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
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