<template>
  <header class="main-header">
    <h1>{{ sectionTitles[currentSection] || 'Обзор' }}</h1>
    <div class="header-actions">
      <UserProfile :user="telegramUser" :show-user-id="true" />
    </div>
  </header>
</template>

<script>
import UserProfile from './UserProfile.vue'

export default {
  name: 'MainHeader',
  components: {
    UserProfile
  },
  props: {
    currentSection: {
      type: String,
      required: true
    },
    telegramUser: {
      type: Object,
      required: true,
      default: () => ({
        first_name: '',
        last_name: '',
        username: '',
        photo_url: null
      })
    }
  },
  setup() {
    const sectionTitles = {
      dashboard: 'Обзор',
      groups: 'Группы',
      teachers: 'Учителя',
      children: 'Дети',
      statistics: 'Статистика'
    }

    return {
      sectionTitles
    }
  }
}
</script>

<style scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: var(--tg-card-bg);
  border-radius: var(--border-radius-card);
  box-shadow: var(--box-shadow-card);
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
}

.main-header h1 {
  font-size: 2em;
  font-weight: 700;
  background: linear-gradient(135deg, var(--tg-blue) 0%, var(--tg-blue-dark) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex: 1;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .main-header {
    padding: 16px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .main-header h1 {
    font-size: 1.6em;
    flex: 1;
    min-width: 0;
  }

  .header-actions {
    flex-shrink: 0;
  }
}

@media (max-width: 480px) {
  .main-header {
    padding: 12px;
  }

  .main-header h1 {
    font-size: 1.4em;
  }
}
</style>
