export default {
    props:['service','name','description','price', 'service_id'],
    template: `
        <div class='jumbotron>
            <h1>{{service}}</h1>
            <p>{{name}}</p>
            <p>{{price}}</p>
            <button>Book</button>
            
        </div>
    `,

    data() {
        return {
            
        }
    },

}