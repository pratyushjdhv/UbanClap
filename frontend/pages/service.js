export default {
    props: ['id'],
    template: `
        <div>
            <h1>Service Page</h1>
            <div v-if="isLoading">Loading...</div>
            <div v-else-if="error">{{ error }}</div>
            <div v-else>
                <h2>Service Details:</h2>
                <ul>
                    <li v-for="(value, key) in service" :key="key">
                        {{ key }}: {{ value }}
                    </li>
                </ul>
                <button v-if="$store.state.role == 'customer'" @click="bookService" class="btn btn-primary">Book Service</button>
            </div>
        </div>
    `,
    data() {
        return {
            service: {},
            isLoading: false,
            error: null,
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
            try {
                const res = await fetch(`${location.origin}/api/bookings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token
                    },
                    body: JSON.stringify({
                        service_id: this.service.id,
                        date: new Date().toISOString().slice(0, 19).replace('T', ' ')
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