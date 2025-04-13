import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueAwesomePaginate from 'vue-awesome-paginate';
// TODO: 테마 적용이 안돼서 임시 주석 처리
// import 'bootstrap'
// import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(VueAwesomePaginate);
app.use(createPinia());
app.use(router);

app.mount('#app');
