import App from './App.vue'
import { createApp, provide, reactive } from 'vue'
import { registerPlugins } from '@/plugins'
import store from '@/store'
import router from '@/router'

const themeState = reactive({
  darkMode: false,
  toggleTheme() {
    this.darkMode = !this.darkMode;
  },
});

provide('themeState', themeState);

const app = createApp(App);

registerPlugins(app);

app.use(router);
app.use(store);

app.config.globalProperties.$pageTitle = 'My Little Finance Analyst';

app.mount('#app');
