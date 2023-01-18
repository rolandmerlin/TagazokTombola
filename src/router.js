import { createRouter,createWebHistory } from 'vue-router'

import home from './pages/home.vue'
import joueur from './pages/joueur.vue'
import lots from './pages/lots.vue'
import tirage from './pages/tirage.vue'

const routes = [
    {
        path:'/',
        component:home
    },
    {
        path:'/participants',
        component:joueur
    },
    {
        path:'/lots',
        component:lots
    },
    {
        path:'/tirage',
        component:tirage
    }
]

const router = createRouter({
    routes,
    history:createWebHistory()
})

export default router