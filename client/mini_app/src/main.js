import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')

// Initialize Feather icons after Vue is mounted
app.config.globalProperties.$nextTick(() => {
  if (window.feather) {
    window.feather.replace()
  }
})
