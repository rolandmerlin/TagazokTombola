<template>
    <div>
        <div class="py-4 text-center text-2xl">Bienvenue dans le gestionnaire de tombola</div>
        <hr>
        <div class="w-96 block mx-auto text-xl text-center my-5 bg-slate-100 rounded-md">
            <br/>
            <b>Nombre de participants : </b>{{ participants.length }}<br/>&nbsp;<br/>
            <b>Nom de ticket : </b>{{ nmb_ticket() }}<br>&nbsp;<br>
            <b>Nombre de lots : </b>{{ nmb_lots() }}<br />&nbsp;<br/>
            <b>Tirage </b>{{ tirage.length?'fait':'non fait' }}<br/>&nbsp;<br/>
        </div>
    </div>
</template>
<script setup>

import { computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()

const participants = computed(()=>store.getters.participants)
const listlots = computed(()=>store.getters.listlots)
const tirage = computed(()=>store.getters.tirage)

const nmb_ticket= function(){
    let t = 0
    for (let p in store.getters.participants) t+= store.getters.participants[p].jticket*1
    return t
}

const nmb_lots= function(){
    let t = 0
    for (let k in store.getters.listlots) t+= store.getters.listlots[k].llquant*1
    return t
}
</script>
<style lang="scss">

</style>