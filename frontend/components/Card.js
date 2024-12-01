export default {
    props:['service','name','description','price', 'service_id'],
    template: `
        <div class='jumbotron'>
            <h1 @click="$router.push('/service/'+ service_id)" >{{service_id}}. {{service}}</h1>
            <p>{{name}}</p>
            <p>{{price}}</p>
            <button v-if="$store.state.role == 'customer'" @click="bookService" class="btn btn-primary">Book</button>
        </div>
    `,

    data() {
        return {
            
        }
    },

    methods: {
        async bookService() {
            try {
                const res = await fetch(location.origin + '/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token
                    },
                    body: JSON.stringify({
                        service_id: this.service_id,
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
    }
}