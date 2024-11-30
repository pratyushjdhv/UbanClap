export default {
    template: `
        <div>
            <h1> this is admin dashboard </h1>
            <button @click="create_csv"> Get Blog Data </button>

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

        },
    }
}
