<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import axios from './Axios'

const store = useStore()

axios.get('/api/joueur').then(d=>{ store.commit('set_participants',d.data) }).catch(e => { console.log('Fail Joueur : ',e); })
axios.get('/api/listlots').then(d=>{ store.commit('set_listlots',d.data) }).catch(e => { console.log('Fail lots : ',e); })
axios.get('/api/tirage').then(d=>{ store.commit('set_tirage',d.data) }).catch(e => { console.log('Fail tirage : ',e); })

const participants = computed(()=>store.getters.participants)
const lots = computed(()=>store.getters.listlots)
const tirage = computed(()=>store.getters.tirage)

</script>

<template>
    <nav class="flex">
      <router-link to="/">Accueil</router-link>
      <router-link to="/participants">Participants</router-link>
      <router-link to="/lots">Lots</router-link>
      <router-link to="/tirage">Tirage</router-link>
    </nav>
    <div class="m-4">
      <router-view></router-view>
    </div>
</template>
<style>
  nav a,nav router-link {
    @apply inline-block py-2 px-4 w-32 cursor-pointer text-center hover:font-bold;
  }
  nav {
    @apply border-b-2 border-blue-800;
  }
</style>
