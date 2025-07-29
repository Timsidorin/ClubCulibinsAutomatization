<template>
    <nav class="sidebar-nav">
      <div class="logo">
        <img src="./icons/logo.ico" alt="Клуб Кулибиных">
        <span>Клуб Кулибиных</span>
      </div>
      <ul>
        <li v-for="item in navigationItems" :key="item.section">
          <a
            href="#"
            :class="['nav-link', { active: currentSection === item.section }]"
            @click.prevent="$emit('navigate', item.section)"
          >
            <i :data-feather="item.icon"></i>
            {{ item.title }}
          </a>
        </li>
      </ul>
    </nav>
  </template>

  <script>
  import { onMounted } from 'vue'

  export default {
    name: 'Sidebar',
    props: {
      currentSection: {
        type: String,
        required: true
      }
    },
    emits: ['navigate'],
    setup() {
      const navigationItems = [
        { section: 'dashboard', title: 'Обзор', icon: 'home' },
        { section: 'groups', title: 'Группы', icon: 'users' },
        { section: 'teachers', title: 'Сотрудники', icon: 'user-check' },
        { section: 'children', title: 'Дети', icon: 'smile' },
      ]

      onMounted(() => {
        // Initialize Feather icons
        if (window.feather) {
          window.feather.replace()
        }
      })

      return {
        navigationItems
      }
    }
  }
  </script>
