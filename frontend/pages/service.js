export default {
    promps:['id'],
    template : `
    <div>
        <h1> this is service page </h1>
    </div>
    `,

    data (){
        return {
            services: [],
            
        }
    },
    
    async mounted() {
        const res = await fetch(location.origin + '/api/service'+ this.id ,{
            headers:{
                'Authentication-Token':this.$store.state.auth_token
            }
        });
        if (res.ok){
            this.services = await res.json();
        }
    },
}