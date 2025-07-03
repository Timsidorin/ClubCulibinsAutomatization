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
        <MainHeader :current-section="currentSection" />
        
        <!-- Dynamic Component Rendering -->
        <component 
          :is="currentComponent" 
          :data="appData"
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
    Children,
    
  },
  setup() {
    const currentSection = ref('dashboard')
    const showModal = ref(false)
    const modalMessage = ref('')
    const modalConfirmCallback = ref(null)
    
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
      // Load initial data
      loadData()
    })

    const loadData = async () => {
      // Simulate data loading
      // Replace with actual API calls
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
