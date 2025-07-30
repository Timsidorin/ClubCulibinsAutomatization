import { createApp } from 'vue'
import App from './App.vue'

async function initTelegramApp() {
  try {
    const { init, viewport } = await import('@telegram-apps/sdk')
    await init()
    
 
    if (viewport.expand.isAvailable()) {
      viewport.expand()
    }
    setTimeout(() => {
      if (viewport.expand.isAvailable()) {
        viewport.expand()
      }
    }, 500)
    
    setTimeout(() => {
      if (viewport.expand.isAvailable()) {
        viewport.expand()
      }
    }, 1000)
    
    console.log('New SDK initialized successfully')
  } catch (error) {
    console.warn('New SDK failed, trying legacy approach:', error)
    
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
     
      tg.expand()
      
      setTimeout(() => { tg.expand() }, 100)
      setTimeout(() => { tg.expand() }, 300)
      setTimeout(() => { tg.expand() }, 600)
      setTimeout(() => { tg.expand() }, 1000)
      setTimeout(() => { tg.expand() }, 2000)
      setTimeout(() => { tg.expand() }, 3000)
    }
  }
  
  setTimeout(() => {
    const app = document.getElementById('app')
    if (app) {
      app.style.width = '100%'
      app.style.minHeight = '100%'
      app.style.maxWidth = '100%'
    }
  }, 100)
}

const app = createApp(App)
app.mount('#app')

initTelegramApp()
