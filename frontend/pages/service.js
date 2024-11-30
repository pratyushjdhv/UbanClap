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
                    <li v-for="(value, key) in services" :key="key">
                        {{ key }}: {{ value }}
                    </li>
                </ul>
            </div>
        </div>
    `,
    data() {
        return {
            services: [],
            isLoading: false,
            error: null,
        };
    },
    async mounted() {
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

            this.services = await res.json();
        } catch (error) {
            console.error('Error fetching service:', error);
            this.error = 'Could not fetch the service. Please try again later.';
        } finally {
            this.isLoading = false;
        }
    },
};