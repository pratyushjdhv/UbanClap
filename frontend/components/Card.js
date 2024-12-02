export default {
    props: ['service', 'name', 'description', 'price', 'service_id'],
    template: `
        <div class='container'>
            <h1 @click="$router.push('/service/'+ service_id)" >{{service_id}}. {{service}}</h1>
            <p>{{name}}</p>
            <p>{{price}}</p>
        </div>
    `,

    data() {
        return {
            
        }
    },

    methods: {}
}