export default {
    template: `
        <div>
            <h1>Admin Dashboard</h1>
            <button @click="create_csv" class="btn btn-primary mb-3">Get Blog Data</button>
            <button @click="$router.push('/customer-list')" class="btn btn-secondary mb-3">View Customer List</button>
            <button @click="$router.push('/admin-bookings')" class="btn btn-info mb-3">View Booking Requests</button>
            <div class="container">
            <canvas id="bookingChart" width= '360' height='360'></canvas>
            </div>
            
        </div>
    `,
    methods: {
        async create_csv() {
            const res = await fetch(location.origin + '/createcsv');
            const task_id = (await res.json()).task_id;
            console.log(res.ok);
            console.log("hahhdahs");
            
            const interval = setInterval(async () => {
                const res = await fetch(location.origin + '/getcsv/' + task_id);
                if (res.ok){
                    console.log('csv created');
                    window.open(`${location.origin}/getcsv/${task_id}`)
                    clearInterval(interval);
                }
            },100)
        },
        async fetchBookingData() {
            try {
                const res = await fetch(`${location.origin}/api/bookings`, {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch bookings: HTTP ${res.status}`);
                }

                const bookings = await res.json();
                this.renderChart(bookings);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        },
        renderChart(bookings) {
            const statusCounts = bookings.reduce((acc, booking) => {
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

            const ctx = document.getElementById('bookingChart').getContext('2d');
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
                            text: 'Bookings Status'
                        }
                    }
                }
            });
        }
    },
    async mounted() {
        await this.fetchBookingData();
    }
}
