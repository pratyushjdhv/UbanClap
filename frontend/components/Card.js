export default {
    props: ["service", "name", "description", "price", "service_id"],
    template: `
        <div class='container'>
            <h1 @click="$router.push('/service/'+ service_id)" >{{service_id}}. {{service}}</h1>
            <p>{{name}}</p>
            <p>{{price}}</p>
            <button v-if="canEditOrDelete" @click="editService" class="btn btn-warning">Edit</button>
            <button v-if="canEditOrDelete" @click="deleteService" class="btn btn-danger">Delete</button>
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
