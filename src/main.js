import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

import './app.css'

const AppVue = createApp(App)
    .use(router)
    .use(store)
    .mount('body')
