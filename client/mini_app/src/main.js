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
      document.documentElement.style.height = '100vh'
      document.body.style.height = '100vh'
      document.body.style.margin = '0'
      document.body.style.padding = '0'
    }
  }
  
  setTimeout(() => {
    const app = document.getElementById('app')
    if (app) {
      app.style.width = '100vw'
      app.style.height = '100vh'
      app.style.position = 'fixed'
      app.style.top = '0'
      app.style.left = '0'
    }
  }, 100)
}

const app = createApp(App)
app.mount('#app')

forceFullscreen()
