<template>
    <div>
        <div class="text-center text-2xl">Tirage</div>
        <br>
        <hr>
        <br>
        <div v-if="mode=='select'">
            <div v-if="tirageOn" class="text-center">
                <div class="font-bold text-center">Un précédent tirage a été effectué</div><br>
                <button class="btn--secondary" v-on:click="Listing()">Liste</button> &nbsp;
                <button class="btn--primary" v-on:click="RandStepByStep()">Affichage randomisé</button>
                <button class="btn--primary" v-on:click="resetTirage()">Reset tirage</button>
            </div>
            <div v-else class="text-center">
                <div class="font-bold text-center">Aucun tirage</div><br>
                <button class="btn--primary" v-on:click="LunchAndStep()">Lancer un tirage pas à pas</button>
                <button class="btn--primary" v-on:click="LunchAndRandListing()">Lancer un tirage intégral, affichage randomisé</button>
            </div>
            <br>
            <hr>            
        </div>
        <br>
        <div v-if="mode=='listing'">
            <div class="w-[960px] mx-auto">
                <div v-for="(t,i) in tirage" :key="'ticket_'+i" class="grid grid-cols-4 odd:bg-slate-100">
                    <span class="text-center p-2">{{i+1}}</span>
                    <span class="text-center p-2">{{ PlayerN(t[1]) }}</span>
                    <span class="text-center p-2">{{ t[2]*1+1 }}</span>
                    <span class="text-center p-2">{{ lotsnumN(t[3]) }}</span>
                </div>
            </div>
        </div>
        <div v-if="mode=='randStep'">
            <div class="text-center bg-gray-200 p-10">
                    Ticket : # {{ step }}<br/>
                    &nbsp;<br/>
                    <span class="text-center p-2 font-bold text-2xl">{{ PlayerN(currentRandTirage[1]) }}</span><br/>
                    &nbsp;<br/>
                    <span class="text-center p-2 text-xl">{{ lotsnumN(currentRandTirage[3]) }}</span>
            </div>
            &nbsp;<br>
            <div class="flex justify-between">
                <button class="btn btn--primary" :disabled="step==0" v-on:click="StepDown()">Précédent</button>
                <button class="btn btn--primary" :disabled="step==(max-1)" v-on:click="StepUp()">Suivant</button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useStore } from 'vuex'
import { computed, ref, reactive, watch } from 'vue'
import axios from '../Axios'

const store = useStore()

const tirage = computed(()=> store.getters.tirage)
const tirageOn = computed(()=> store.getters.tirage.length)
const resetTirage = () => store.commit('set_tirage',[])
const currentRandTirage = computed( () => store.getters.randtirage[step.value] )

const step = ref(0)
const mode = ref('select')
const max = ref(0)

const ItemCurrent = computed(()=> store.getters.tirage[step.value] )
const ItemC = (n)=> store.getters.tirage[n]
const LotsC = (n)=> lotsnumN(tirage.value[n][3])
//const PlayC = (n)=> store.getters.participants[tirage.value[n][]]

function StepUp(){ if (step.value<(store.getters.tirage.length-1)) step.value +=1 }
function StepDown(){ if (step.value>0) step.value -- }

function Player(){ return store.getters.participants[ItemCurrent.value['1']]?.jname || 'Not found' }
function PlayerN(n){ return store.getters.participants[n]?.jname || 'Not found' }
function PlayerTRand(r){
    console.log(store.getters.randtirage)
    const [tid,tjid,tticket,tlid,randOrder] = store.getters.randtirage[r]
    return typeof store.getters.participants[tjid] !== 'undefined' ? store.getters.participants[tjid].jname : 'Not found'
}
function ItemRand(r){
    const [tid,tjid,tticket,tlid,randOrder] = store.getters.randtirage[r]
    return store.getters.tirage[tlid]?.jname || 'Not found'    
}

function PlayerNumTicket(){  return ItemCurrent.value['2']*1+1; }
function PlayerNumTicketN(n){ return store.getters.participants[n].jticket; }

function PlayerCount(){ return store.getters.participants.length }

async function LancerLeTirage(){ await axios.get('api/makeTirage',{'Cache-Control': 'no-cache', 'Pragma': 'no-cache', 'Expires': '0'}).then(d=>{ store.commit('set_tirage',d.data) }) }

function StepByStep(){
    step.value = 0
    mode.value = 'stepByStep'
}

function RandStepByStep(){
    step.value = 0 
    mode.value = 'randStep'
}

const RandomTirage = ref([])
const FullList = ()=>{
    let j = []
    let countstep = store.getters.tirage.length
    step.value = 0
    for(let i=1; i<=countstep; i++){
        step.value=step.value++
        let A = AllLotsnum()
        j.push([ Player() , A.llname, A.randOrder ])
    }
    return j
}

store.commit('all', FullList().sort( (a,b) => a[2] - b[2] ))
watch(()=> store.getters.all.length,(_)=>{
    max.value = store.getters.tirage.length
    store.commit('all', FullList().sort( (a,b) => a[2] - b[2] ))
})

const TirageFullRandPlayer = computed(() => {
    if (store.getters.all.length==0) return ''
    return store.getters.all[step.value][0]
})
const TirageFullRandLot    = computed(() => {
    if (store.getters.all.length==0) return ''
    return store.getters.all[step.value][1]
})

function PlayerRand(){
    /*
    for(let i=1;i<PlayerCount();i++) RandomTirage.value.push(i-1)
    for(let i=1;i<PlayerCount();i++){
        let r = Math.floor(Math.random() * PlayerCount())
        [RandomTirage.value[i],RandomTirage.value[r]]=[RandomTirage.value[r],RandomTirage.value[i]]
    }
    ItemCurrent.value = 0**/
}
FullList()
PlayerRand()


function Listing(){ mode.value = 'listing' }


async function LunchAndStep(){
    await LancerLeTirage()
    StepByStep()
}

async function LunchAndRandListing(){
    await LancerLeTirage()
    RandStepByStep()
}

function lotsnum(){
    let n = ItemCurrent.value["3"]
    if (n<0) return 'Perdu : pas de lot pour vous'
    let k = 0
    for (const l of store.getters.listlots){
        let kmin = k
        let kmax = k + l.llquant
        console.log(l,kmin,kmax);
        if ((k<=kmin) && (n<kmax)) return l.llname
        k+=l.llquant
    }
    return 'Not found'
}

function AllLotsnum(){
    let n = ItemCurrent.value["3"]
    if (n<0) return 'Perdu : pas de lot pour vous'
    let k = 0
    for (const l of store.getters.listlots){
        let kmin = k
        let kmax = k + l.llquant
        console.log(l,kmin,kmax);
        if ((k<=kmin) && (n<kmax)) return l
        k+=l.llquant
    }
    return {llname:'Not found',randOrder:1e12}
}

function lotsnumN(n){
    if (n<0) return 'Perdu : pas de lot pour vous'
    let k = 0
    for (const l of store.getters.listlots){
        let kmin = k
        let kmax = k + l.llquant
        console.log(l,kmin,kmax);
        if ((k<=kmin) && (n<kmax)) return l.llname
        k+=l.llquant
    }
    return 'Not found'
}

function LunchAndListing(){
    LancerLeTirage()
    Listing()
}

</script>
<style lang="scss">

</style>