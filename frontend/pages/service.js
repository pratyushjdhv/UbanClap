export default {
    props: ['id'],
    template: `
    <div class="service-page-container">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
        <div class="service-details-box">
            <h1>Service Details:</h1>
            <div class="service-details-container">
                <ul>
                    <li v-for="(value, key) in service" :key="key" v-if="key !== 'id' && key !== 'emp_id'">
                        <span v-if="key !== 'employee'">{{ key }}:</span>
                        <span v-if="key !== 'employee'">{{ value }}</span>
                        <span v-else>Employee: {{ service.employee.name }}</span>
                    </li>
                </ul>
            </div>
            <div v-if="$store.state.role == 'customer'">
                <input type="datetime-local" v-model="bookingDateTime" class="form-control mb-3" />
                <button @click="bookService" class="btn btn-primary">Book Service</button>
            </div>
        </div>
    </div>
</div>

    `,
    data() {
        return {
            service: {},
            isLoading: false,
            error: null,
            bookingDateTime: ''
        };
    },
    methods: {
        async fetchService() {
            this.isLoading = true;
            this.error = null;

            try {
                const res = await fetch(`${location.origin}/api/service/${this.id}`, {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch service with id ${this.id}: HTTP ${res.status}`);
                }

                this.service = await res.json();
            } catch (error) {
                console.error('Error fetching service:', error);
                this.error = 'Could not fetch the service. Please try again later.';
            } finally {
                this.isLoading = false;
            }
        },
        async bookService() {
            if (!this.bookingDateTime) {
                alert('Please select a date and time for the booking.');
                return;
            }

            try {
                const res = await fetch(`${location.origin}/api/bookings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token
                    },
                    body: JSON.stringify({
                        service_id: this.service.id,
                        emp_id: this.service.emp_id,
                        date: this.bookingDateTime
                    })
                });
                if (res.ok) {
                    alert('Service booked');
                } else {
                    const data = await res.json();
                    alert('Service not booked: ' + data.message);
                }
            } catch (error) {
                console.error('Error booking service:', error);
                alert('Service not booked: ' + error.message);
            }
        }
    },
    async mounted() {
        await this.fetchService();
    }
};