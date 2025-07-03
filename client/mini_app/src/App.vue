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

        <!-- Dynamic Component Rendering -->
        <component
          :is="currentComponent"
          :data="appData"
          :telegram-user="telegramUser"
          @update-data="updateData"
          @navigate="handleNavigation"
        />
      </main>

      <!-- Bottom Tab Bar Navigation (Mobile) -->
      <BottomTabBar
        :current-section="currentSection"
        @navigate="handleNavigation"
      />
    </div>

    <!-- Confirmation Modal -->
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
    Children
  },
  setup() {
    const currentSection = ref('dashboard')
    const showModal = ref(false)
    const modalMessage = ref('')
    const modalConfirmCallback = ref(null)

    // Данные пользователя Telegram
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
        children: 'Children'
      }
      return components[currentSection.value] || 'Dashboard'
    })

    const initTelegramWebApp = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp

        // Инициализация Web App
        tg.ready()

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

        // Настройка темы приложения
        if (tg.colorScheme === 'dark') {
          document.body.classList.add('dark-theme')
        }

        tg.MainButton.setText('Сохранить')
        tg.MainButton.hide()

      } else {
        // Для разработки вне Telegram
        telegramUser.value = {
          id: 123456789,
          first_name: 'Тестовый',
          last_name: 'Пользователь',
          username: 'testuser',
          photo_url: null
        }
      }
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
      loadData()
    })

    const loadData = async () => {
      appData.value = {
        groups: [
          { id: 1, name: 'Группа А', studentsCount: 15, teacher: 'Иванов И.И.' },
          { id: 2, name: 'Группа Б', studentsCount: 12, teacher: 'Петрова П.П.' }
        ],
        teachers: [
          { id: 1, name: 'Иванов Иван Иванович', email: 'ivanov@example.com', groups: ['Группа А'] },
          { id: 2, name: 'Петрова Петра Петровна', email: 'petrova@example.com', groups: ['Группа Б'] }
        ],
        children: [
          { id: 1, name: 'Алексей Смирнов', group: 'Группа А', coins: 150 },
          { id: 2, name: 'Мария Козлова', group: 'Группа Б', coins: 200 }
        ],
        activities: [
          { id: 1, text: 'Добавлен новый ребенок: Алексей Смирнов', timestamp: new Date() },
          { id: 2, text: 'Создана новая группа: Группа А', timestamp: new Date() }
        ]
      }
    }

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
