import { createApp } from 'vue'
import App from './App.vue'

async function forceFullscreen() {
  // Вариант 1: Через новый SDK
  try {
    const { init, viewport } = await import('@telegram-apps/sdk')
    await init()
    
    if (viewport.requestFullscreen.isAvailable()) {
      await viewport.requestFullscreen()
    }
    if (viewport.expand.isAvailable()) {
      viewport.expand()
    }
  } catch (error) {
    console.warn('New SDK failed, trying legacy approach:', error)
    
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()

    }
  }
  
  setTimeout(() => {
    const app = document.getElementById('app')
    if (app) {
      app.style.width = '100vw'
      app.style.minHeight = '100vh' 
      
    }
  }, 100)
}

const app = createApp(App)
app.mount('#app')

forceFullscreen()
