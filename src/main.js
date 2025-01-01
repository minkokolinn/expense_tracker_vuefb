import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// bootstrap setup
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// fontawesome setup
import '@fortawesome/fontawesome-free/css/all.min.css'

createApp(App).use(router).mount('#app')
