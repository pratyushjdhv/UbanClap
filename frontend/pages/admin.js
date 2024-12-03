export default {
    template: `
    <div class="admin-dashboard">
    <h1 class="dashboard-title">Admin Dashboard</h1>
    <div class="dashboard-buttons">
      <button @click="create_csv" class="btn btn-primary">Get Blog Data</button>
      <button @click="$router.push('/customer-list')" class="btn btn-secondary">View Customer List</button>
      <button @click="$router.push('/admin-bookings')" class="btn btn-info">View Booking Requests</button>
    </div>
    <div class="charts-container">
      <div class="chart">
        <canvas id="bookingChart" width="360" height="360"></canvas>
      </div>
      <div class="chart mt-4">
        <canvas id="userChart" width="360" height="360"></canvas>
      </div>
    </div>
  </div>
    `,
    data() {
        return {
            bookings: [],
            users: {
                customers: 0,
                employees: 0
            }
        };
    },
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

                this.bookings = await res.json();
                this.renderBookingChart();
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        },
        async fetchUserData() {
            try {
                const res = await fetch(`${location.origin}/api/users`, {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch users: HTTP ${res.status}`);
                }

                const users = await res.json();
                this.users.customers = users.filter(user => user.roles[0].name === 'customer').length;
                this.users.employees = users.filter(user => user.roles[0].name === 'emp').length;
                this.renderUserChart();
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        renderBookingChart() {
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
        },
        renderUserChart() {
            const data = {
                labels: ['Customers', 'Employees'],
                datasets: [{
                    data: [this.users.customers, this.users.employees],
                    backgroundColor: ['#36A2EB', '#FF6384'],
                }]
            };

            const ctx = document.getElementById('userChart').getContext('2d');
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
                            text: 'User Distribution'
                        }
                    }
                }
            });
        }
    },
    async mounted() {
        await this.fetchBookingData();
        await this.fetchUserData();
    }
}
