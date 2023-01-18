<template>
    <div>
        <div class="py-4 text-center text-2xl">
            Gestion des participants
        </div>
        <hr>
        <div class="inline-right text-right">
            <button class="btn--primary" v-on:click="FormCreateParticipant()" v-if="mode!='create'">Créer un participant</button>
            <button class="btn--primary" v-if="mode!='listing'" v-on:click="mode='listing'">Retour à la liste</button>
        </div>
        <hr>
        <div class="w-[240px] mx-auto text-center py-4">
            <b>Nombre total de ticket : </b> {{nmb_ticket()}}
        </div>
        <div v-if="mode=='listing'" class="w-[640px] mx-auto">
            <div class="listing-joueur bg-slate-200">
                <b class="text-center py-2">Nom du participant</b>
                <b class="text-center py-2">Nombre de ticket</b>
                <b class="text-center py-2">Action</b>
            </div>
            <div v-for="(p,i) in participants" :key="'participant_'+i" class="listing-joueur odd:bg-slate-200">
                <span class="text-center p-2 font-bold">{{ p.jname }}</span>
                <span class="text-center p-2">{{ p.jticket }}</span>
                <div class="flex place-content-around">
                    <span><button class="btn--primary" v-on:click="Editer(p)">Editer</button></span>
                    <span><button class="btn--secondary" v-on:click="DeletePart(p)">Delete</button></span>                    
                </div>
            </div>
        </div>
        <div v-if="(mode=='create') || (mode=='edit')" class="w-[480px] mx-auto bg-slate-100 round-2xl p-2 my-4">
            <b v-if="ed_id">Création</b>
            <b v-else>Edition</b>
            <br/>
            <div>
                <input type="hidden" v-model="ed_id">
                <div class="formgrid">
                    <b>Nom du participant : </b><input type="text" v-model="ed_name"/>
                </div>
                <div class="formgrid">
                    <b>Nombre de ticket : </b><input type="number" v-model="ed_quant"/>
                </div>
                <div class="text-center">
                    <button class="btn--primary w-[80%]" v-on:click="ParticipantCreate()" v-if="mode=='create'">Créer</button>
                    <button class="btn--primary w-[80%]" v-on:click="ParticipantUpdate()" v-if="mode=='edit'">Sauvegarde</button>
                    <br>
                    <button class="btn--secondary" v-on:click="mode='listing'">Annuler</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import axios from '../Axios'
const store = useStore()

const mode = ref('listing')
const edt_part = ref(false)

const ed_id = ref('')
const ed_name = ref('')
const ed_quant = ref('')

function Editer(p){
    edt_part.value = p
    ed_id.value = p.jid
    ed_name.value = p.jname
    ed_quant.value = p.jticket
    mode.value='edit'
}

function FormCreateParticipant(){
    ed_id.value=null
    ed_name.value=''
    ed_quant.value=''
    mode.value='create'
}

function ParticipantUpdate(){
    axios.put('/api/joueur',{
        'jid':ed_id.value,
        'jname':ed_name.value,
        'jticket':ed_quant.value
    }).then(d=>{
        mode.value = 'listing'
        store.commit('set_participants',d.data)
    })
}

function DeletePart(p){
    if (window.confirm('Voulez-vous supprimer amicalement "'+p.jname+'" ? \n[OK=Appliquer, Annuler=Ne pas appliquer')){
        axios.delete('/api/joueur/'+p.jid)
            .then(d => {
                store.commit('set_participants',d.data)
            })        
    }

}

const participants = computed(()=>store.getters.participants)
const lots = computed(()=>store.getters.lots)
const tirage = computed(()=>store.getters.tirage)

function ParticipantCreate(){
    axios.post('/api/joueur',{
        'jid':null,
        'jname':ed_name.value,
        'jticket':ed_quant.value
    }).then(d => {
        if (typeof d.data.joueur != 'undefined'){
            store.commit('set_participants',d.data)
            mode.value='listing'
        }

    }).catch(d=> { console.log(d) })
}

const nmb_ticket= function(){
    let t = 0
    for (let p in store.getters.participants) t+= store.getters.participants[p].jticket*1
    return t
}

watch(ed_name,jname=>{ if (jname!=jname.toLowerCase()) ed_name.value=jname.toLowerCase() })

</script>
<style>
    .formgrid{
        @apply grid grid-cols-2 m-2;
    }
    .listing-joueur {
        @apply grid grid-cols-3;
    }
</style>