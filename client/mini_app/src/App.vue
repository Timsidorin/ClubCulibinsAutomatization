<template>
  <div id="app">
    <!-- Уведомление о расширении для маленького окна -->
    <div v-if="showExpandHelper" class="expand-helper">
      <div class="expand-helper-content">
        <p>Для лучшего опыта использования рекомендуем развернуть приложение</p>
        <button class="btn btn-primary" @click="expandApp">
          <i data-feather="maximize-2"></i>
          Развернуть
        </button>
        <button class="btn btn-secondary" @click="showExpandHelper = false">
          Закрыть
        </button>
      </div>
    </div>

    <div class="app-container">
      <!-- Sidebar Navigation (Desktop) -->
      <Sidebar
        :current-section="currentSection"
        @navigate="handleNavigation"
      />

      <!-- Main Content Area -->
      <main class="main-content">
        <MainHeader
          :current-section="currentSection"
          :telegram-user="telegramUser"
        />

        <component
          :is="currentComponent"
          :data="appData"
          :telegram-user="telegramUser"
          @update-data="updateData"
          @navigate="handleNavigation"
        />
      </main>

      <BottomTabBar
        :current-section="currentSection"
        @navigate="handleNavigation"
      />
    </div>

    <ConfirmationModal
      v-if="showModal"
      :message="modalMessage"
      @confirm="handleModalConfirm"
      @cancel="handleModalCancel"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import MainHeader from './components/MainHeader.vue'
import BottomTabBar from './components/BottomTabBar.vue'
import ConfirmationModal from './components/ConfirmationModal.vue'
import Dashboard from './components/Dashboard.vue'
import Groups from './components/Groups.vue'
import Teachers from './components/Teachers.vue'
import Children from './components/Children.vue'

export default {
  name: 'App',
  components: {
    Sidebar,
    MainHeader,
    BottomTabBar,
    ConfirmationModal,
    Dashboard,
    Groups,
    Teachers,
    Children,
  },
  setup() {
    const currentSection = ref('dashboard')
    const showModal = ref(false)
    const modalMessage = ref('')
    const modalConfirmCallback = ref(null)
    const showExpandHelper = ref(false)

    const telegramUser = ref({
      id: null,
      first_name: '',
      last_name: '',
      username: '',
      photo_url: null
    })

    const appData = ref({
      groups: [],
      teachers: [],
      children: [],
      activities: []
    })

    const currentComponent = computed(() => {
      const components = {
        dashboard: 'Dashboard',
        groups: 'Groups',
        teachers: 'Teachers',
        children: 'Children',
      }
      return components[currentSection.value] || 'Dashboard'
    })

    const checkAndShowExpandHelper = () => {
      setTimeout(() => {
        if (window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp
          if (tg.viewportHeight < 400) {
            showExpandHelper.value = true
          }
        }
      }, 3000)
    }

    const expandApp = () => {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp
        tg.expand()
        showExpandHelper.value = false
        
        // Дополнительные попытки для Desktop
        setTimeout(() => { tg.expand() }, 100)
        setTimeout(() => { tg.expand() }, 300)
        setTimeout(() => { tg.expand() }, 600)
      }
    }

    const initTelegramWebApp = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp

        tg.ready()

        // Определяем платформу
        const isDesktop = tg.platform === 'tdesktop'
        console.log(`Platform: ${tg.platform}, Initial height: ${tg.viewportHeight}px`)

        // Супер агрессивное расширение для Desktop
        if (isDesktop) {
          // Мгновенные попытки
          for (let i = 0; i < 5; i++) {
            tg.expand()
          }
          
          // Множественные таймауты для Desktop
          const delays = [50, 100, 200, 300, 500, 800, 1000, 1500, 2000, 3000, 4000, 5000]
          delays.forEach(delay => {
            setTimeout(() => {
              tg.expand()
              console.log(`Desktop expand attempt at ${delay}ms, height: ${tg.viewportHeight}px`)
            }, delay)
          })
        } else {
          // Для Web и mobile
          tg.expand()
          setTimeout(() => { tg.expand() }, 100)
          setTimeout(() => { tg.expand() }, 500)
        }

        // Настройка цветовой схемы
        tg.headerColor = 'secondary_bg_color'
        tg.backgroundColor = 'bg_color'

        // Получение данных пользователя
        const user = tg.initDataUnsafe?.user
        if (user) {
          telegramUser.value = {
            id: user.id,
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            username: user.username || '',
            photo_url: user.photo_url || null
          }
        }

        // Применение темной темы если нужно
        if (tg.colorScheme === 'dark') {
          document.body.classList.add('dark-theme')
        }

        // Настройка главной кнопки
        tg.MainButton.setText('Сохранить')
        tg.MainButton.hide()

        // Добавляем обработчики событий
        tg.onEvent('themeChanged', () => {
          if (tg.colorScheme === 'dark') {
            document.body.classList.add('dark-theme')
          } else {
            document.body.classList.remove('dark-theme')
          }
        })

        // Обработчик изменения размера viewport
        tg.onEvent('viewportChanged', () => {
          console.log(`Viewport changed: ${tg.viewportHeight}px`)
          
          // Если окно всё ещё маленькое, пытаемся расширить снова
          if (tg.viewportHeight < 450) {
            setTimeout(() => { tg.expand() }, 50)
            setTimeout(() => { tg.expand() }, 200)
            setTimeout(() => { tg.expand() }, 500)
          }
          
          const app = document.getElementById('app')
          if (app) {
            const minHeight = Math.max(tg.viewportHeight, 500)
            app.style.height = `${minHeight}px`
            app.style.minHeight = `${minHeight}px`
          }
        })

        // Непрерывные попытки расширения для Desktop в течение 15 секунд
        if (isDesktop) {
          const expandInterval = setInterval(() => {
            if (tg.viewportHeight > 450) {
              clearInterval(expandInterval)
              console.log('Desktop expansion successful!')
            } else {
              tg.expand()
              console.log(`Still trying to expand... Current height: ${tg.viewportHeight}px`)
            }
          }, 800)

          // Останавливаем попытки через 15 секунд
          setTimeout(() => {
            clearInterval(expandInterval)
            console.log('Stopped expansion attempts')
          }, 15000)
        }
      }
    }

    const handleNavigation = (section) => {
      currentSection.value = section
      
      if (window.history && window.history.pushState) {
        window.history.pushState({}, '', `#${section}`)
      }
    }

    const updateData = (newData) => {
      appData.value = { ...appData.value, ...newData }
    }

    const showConfirmationModal = (message, callback) => {
      modalMessage.value = message
      modalConfirmCallback.value = callback
      showModal.value = true
    }

    const handleModalConfirm = () => {
      if (modalConfirmCallback.value) {
        modalConfirmCallback.value()
      }
      showModal.value = false
    }

    const handleModalCancel = () => {
      showModal.value = false
    }

    const handleResize = () => {
      const app = document.getElementById('app')
      if (app && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp
        const minHeight = Math.max(tg.viewportHeight, 500)
        app.style.height = `${minHeight}px`
        app.style.minHeight = `${minHeight}px`
      }
    }

    const initFromHash = () => {
      const hash = window.location.hash.slice(1)
      if (hash && ['dashboard', 'groups', 'teachers', 'children'].includes(hash)) {
        currentSection.value = hash
      }
    }

    onMounted(() => {
      initTelegramWebApp()
      initFromHash()
      checkAndShowExpandHelper()
      
      window.addEventListener('resize', handleResize)
      window.addEventListener('hashchange', initFromHash)
      
      // Устанавливаем начальные размеры с большей задержкой
      setTimeout(() => {
        const app = document.getElementById('app')
        if (app && window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp
          const minHeight = Math.max(tg.viewportHeight, 500)
          
          app.style.width = '100%'
          app.style.height = `${minHeight}px`
          app.style.minHeight = `${minHeight}px`
          app.style.maxWidth = '100%'
          
          console.log(`Set app height to: ${minHeight}px`)
        }
      }, 300)
    })

    return {
      currentSection,
      currentComponent,
      appData,
      telegramUser,
      showModal,
      modalMessage,
      showExpandHelper,
      handleNavigation,
      updateData,
      showConfirmationModal,
      handleModalConfirm,
      handleModalCancel,
      expandApp
    }
  }
}
</script>

<style>
@import './assets/styles.css';

/* Дополнительные стили для адаптивности */
#app {
  width: 100%;
  height: 100%;
  min-height: 500px; /* Минимальная высота для комфорта */
  max-width: 100%;
  overflow-x: hidden;
}

.app-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .app-container {
    flex-direction: row;
  }
}

/* Стили для уведомления о расширении */
.expand-helper {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  background: var(--tg-blue);
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  max-width: 90%;
  text-align: center;
}

.expand-helper-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.expand-helper-content p {
  margin: 0;
  font-size: 0.9em;
  line-height: 1.3;
}

.expand-helper-content .btn {
  font-size: 0.8em;
  padding: 6px 12px;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.expand-helper-content .btn-primary {
  background: rgba(255,255,255,0.2);
  color: white;
}

.expand-helper-content .btn-secondary {
  background: transparent;
  color: rgba(255,255,255,0.8);
}

/* Адаптивность для разных размеров окна */
@media (max-height: 600px) {
  .main-content {
    padding: 12px;
  }
  
  .section-header {
    padding: 16px;
  }
}

@media (max-height: 400px) {
  .main-content {
    padding: 8px;
  }
  
  .section-header {
    padding: 12px;
  }
}

body.dark-theme {
  --tg-bg: #1a1a1a;
  --tg-card-bg: #2d2d2d;
  --tg-text: #ffffff;
  --tg-text-light: #b0b0b0;
  --tg-border: #404040;
  --box-shadow-card: 0 4px 16px rgba(0, 0, 0, 0.2);
}

* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
</style>
