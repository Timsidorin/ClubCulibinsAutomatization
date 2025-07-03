<template>
    <header class="main-header">
      <h1>{{ sectionTitles[currentSection] || 'Обзор' }}</h1>
      <div class="header-actions">
        <!-- Quick actions or user info -->
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: 'MainHeader',
    props: {
      currentSection: {
        type: String,
        required: true
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
  