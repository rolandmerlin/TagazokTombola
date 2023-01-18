<template>
    <div>
        <div class="py-4 text-center text-2xl">
            Gestion des lots
        </div>
        <hr>
        <div class="text-right">
            <button class="btn--primary" v-on:click="FormCreateLots()">Créer un lot</button>
        </div>
        <hr>
        <br>
        <div class="text-center w-[200px] mx-auto"><b>Nombre de lots : </b> {{ nmb_lots() }}</div>
        <br>
        <div class="w-[480px] mx-auto bg-slate-100 py-4" v-if="mode!='listing'">
            <div class="font-bold text-center"> Création des lots </div>
            <hr>
            <div class="formgrid">
                <label for="llname"><b>Nom du lots</b></label><input type="text" name="llname" v-model="llname">
            </div>
            <div class="formgrid">
                <label for="llquant"><b>Nombres de lots</b></label><input type="number" name="llquant" v-model="llquant">
            </div>
            <br>
            <div class="text-center">
                <button class="btn--primary" v-on:click="CreateLots()" v-if="mode=='create'">Créer</button>
                <button class="btn--primary" v-on:click="SauvegardeLots()" v-if="mode=='edit'">Sauvegarder</button>
                <button class="btn--secondary" v-on:click="mode='listing'">Annuler</button>
            </div>
        </div>
        <div v-if="mode=='listing'">
            <div class="listlots bg-slate-200 w-[640px] mx-auto">
                <b class="p-2 text-center">Nom du lot</b>
                <b class="p-2 text-center">Nombre de ce type de lot</b>
                <b class="p-2 text-center">Action</b>
            </div>
            <div v-for="(l,i) in listlots" :key="'ll'+i" class="listlots odd:bg-slate-200 w-[640px] mx-auto">
                <span class="p-2 font-bold text-center">{{l.llname}}</span>
                <span class="p-2 text-center">{{l.llquant}}</span>
                <span>
                    <button class="btn--primary" v-on:click="EditerLots(l)">Editer</button>
                    <button class="btn--secondary" v-on:click="DeleteLots(l)">Supprimer</button>
                </span>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed }  from 'vue'
import { useStore } from 'vuex'
import axios from '../Axios'

const store = useStore()

const llid = ref('')
const llname = ref('')
const llquant = ref('')
const mode = ref('listing')

const listlots = computed(()=> store.getters.listlots )

function FormCreateLots(){
    llid.value = null
    llname.value = ''
    llquant.value = 0
    mode.value = 'create'
}
function CreateLots(){
    axios.post('/api/listlots',{
        llid:(llid.value),
        llname:(llname.value),
        llquant:(llquant.value)
    }).then(d=>{
        console.log(d)
        store.commit('set_listlots',d.data)
        mode.value = 'listing'
    })
}

function SauvegardeLots(){
    axios.put('/api/listlots',{
        "llid":llid.value,
        "llname":llname.value,
        "llquant":llquant.value
    }).then(d=>{
        store.commit('set_listlots',d.data)
        mode.value = 'listing'
    })
}

function EditerLots(l){
    llid.value = l.llid
    llname.value = l.llname
    llquant.value = l.llquant
    mode.value = 'edit'
}
function DeleteLots(l){
    if (window.confirm('Voulez-vous supprimer '+l.llquant+ ' de "'+l.llname+'" ? \n [OK]=Appliquer  [Annuler]=Ne pas appliquer'))
        axios.delete('/api/listlots/'+l.llid).then(d=>{ store.commit('set_listlots',d.data) })
}

const nmb_lots= function(){
    let t = 0
    for (let k in store.getters.listlots) t+= store.getters.listlots[k].llquant*1
    return t
}
</script>
<style>
    .listlots { @apply grid grid-cols-3; }
    .formgrid{ @apply grid grid-cols-2 m-2; }
</style>