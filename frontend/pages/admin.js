export default {
    template: `
        <div>
            <h1>Admin Dashboard</h1>
            <button @click="create_csv" class="btn btn-primary mb-3">Get Blog Data</button>
            <button @click="$router.push('/customer-list')" class="btn btn-secondary mb-3">View Customer List</button>
        </div>
    `,
    methods: {
        async create_csv() {
            const res = await fetch(location.origin + '/createcsv');
            const task_id = (await res.json()).task_id;
            console.log(res.ok);
            console.log("hahhdahs");
            
            const interval = setInterval(async () => {
                const res = await fetch(location.origin + '/getcsv/' + task_id);
                if (res.ok){
                    console.log('csv created');
                    window.open(`${location.origin}/getcsv/${task_id}`)
                    clearInterval(interval);
                }
            },100)
        }
    }
}
