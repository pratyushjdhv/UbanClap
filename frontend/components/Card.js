export default {
    props: ["service", "name", "description", "price", "service_id"],
    template: `
    <div class="card-container">
    <!-- Service Title -->
    <h1 @click="$router.push('/service/' + service_id)" class="card-title">
        {{ service_id }}. {{ service }}
    </h1>
    
    <!-- Service Name and Price -->
    <p class="card-name">Name: {{ name }}</p>
    <p class="card-price">₹{{ price }}</p>
    
    <!-- Action Buttons (Edit & Delete) -->
    <div class="card-actions">
        <button v-if="canEditOrDelete" @click="editService" class="btn btn-info">Edit</button>
        <button v-if="canEditOrDelete" @click="deleteService" class="btn btn-danger">Delete</button>
    </div>
</div>
    `,
    computed: {
        canEditOrDelete() {
            return (
                this.$store.state.role === "emp" || this.$store.state.role === "admin"
            );
        },
    },
    methods: {
        editService() {
            this.$router.push(`/edit-service/${this.service_id}`);
        },
        async deleteService() {
            if (confirm("Are you sure you want to delete this service?")) {
                try {
                    const res = await fetch(
                        `${location.origin}/api/service/${this.service_id}`,
                        {
                            method: "DELETE",
                            headers: {
                                "Authentication-Token": this.$store.state.auth_token,
                            },
                        }
                    );

                    if (!res.ok) {
                        throw new Error(`Failed to delete service: HTTP ${res.status}`);
                    }

                    alert("Service deleted");
                    this.$emit("service-deleted", this.service_id);
                } catch (error) {
                    console.error("Error deleting service:", error);
                    alert("Could not delete the service. Please try again later.");
                }
            }
        },
    },
};
