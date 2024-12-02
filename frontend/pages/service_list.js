import Card from "../components/Card.js";

export default {
    template: `
    <div class='p-4 service-list'>
    <h1 class="list-title">List of Services</h1>
    <div class="search-wrapper">
        <span class="bi bi-search search-icon"></span>
        <input type='text' v-model="searched" placeholder="Search by service" class="form-control mb-3 search-input">
    </div>

    <div class="services-grid">
        <Card 
            v-for="service in searchedServices" 
            :key="service.id" 
            :service="service.service" 
            :name="service.name" 
            :description="service.description" 
            :price="service.price" 
            :service_id="service.id" 
            @service-deleted="removeservice"
        />
    </div>
</div>   
    `,

    data() {
        return {
            services: [],
            searched: "",
        };
    },
    computed: {
        searchedServices() {
            return this.services.filter((service) =>
                service.service.toLowerCase().includes(this.searched.toLowerCase())
            );
        },
    },
    methods: {
        async searching() {
            try {
                const res = await fetch(location.origin + "/api/services",{
                        headers: {
                            "Authentication-Token": this.$store.state.auth_token,
                        },
                    });

                if (res.ok) {
                    this.services = await res.json();
                }                
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        },
        removeservice(id) {
            this.services = this.services.filter((service) => service.id !== id);
        },
    },

    async mounted() {
        await this.searching();
    },

    components: {
        Card,
    },
};
