const store = new Vuex.Store({
    state: {
        auth_token : null,
        loggedIn : false,
        role : null,
        user_id : null,
        username : null,

    },
    mutations: {
        setUser(state){
            try{
                if(JSON.parse(localStorage.getItem('user'))){
                    const user = JSON.parse(localStorage.getItem('user'));
                    state.auth_token = user.token;
                    state.loggedIn = true;
                    state.role = user.role;
                    state.user_id = user.user_id;
                    state.username = user.user_name;

                }
            }catch{
                console.log('No user logged in');
            }
        },
        logout(state){
            state.auth_token = null;
            state.loggedIn = false;
            state.role = null;
            state.user_id = null;
            state.username = null;

            localStorage.removeItem('user');
        }
    }
});

store.commit("setUser");

export default store;