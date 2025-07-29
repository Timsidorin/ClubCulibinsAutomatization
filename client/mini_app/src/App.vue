<template>
  <div id="app">
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

    const initTelegramWebApp = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp

    tg.ready()

    // Принудительное расширение
    tg.expand()

    // Установка полноэкранного режима через все доступные методы
    if (tg.requestFullscreen) {
      tg.requestFullscreen()
    }

    // Скрытие элементов интерфейса Telegram
    tg.headerColor = 'secondary_bg_color'
    tg.backgroundColor = 'bg_color'

    // Остальная логика...
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

    if (tg.colorScheme === 'dark') {
      document.body.classList.add('dark-theme')
    }

    tg.MainButton.setText('Сохранить')
    tg.MainButton.hide()
  }

  setTimeout(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand()
    }
  }, 500)
}

    const handleNavigation = (section) => {
      currentSection.value = section
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

    onMounted(() => {
      initTelegramWebApp()
    })

    return {
      currentSection,
      currentComponent,
      appData,
      telegramUser,
      showModal,
      modalMessage,
      handleNavigation,
      updateData,
      showConfirmationModal,
      handleModalConfirm,
      handleModalCancel
    }
  }
}
</script>

<style>
@import './assets/styles.css';
</style>
