import { createStore } from 'vuex'

const store = createStore({
    state:{
        participants:[],
        listlots:[],
        tirage:[],
        randtirage:[],
        all:[]
    },
    getters:{
        participants:(state)=> state.participants,
        listlots:(state)=>state.listlots,
        tirage:(state)=>state.tirage,
        randtirage:(state)=>state.randtirage,
        all:(state)=>state.all,
        rall:(state)=>(index)=> index<state.all.length?state.all[index]:['Non trouvé','Non trouvé',1e12]
    },
    mutations:{
        set_participants:(state,value)=>{ if (typeof value.joueur != 'undefined'){ state.participants = value.joueur } },
        set_listlots:(state,value)=>{ if (typeof value.listlots != 'undefined'){ state.listlots = value.listlots } },
        set_tirage:(state,value)=>{
            if (typeof value.tirage != 'undefined'){
                state.tirage = value.tirage
                state.randtirage = [...value.tirage].sort((a,b)=> a[4]>b[4]?1:-1 )
            }
        },
        all:(state,value) => { state.all = value }
    }
})

export default store