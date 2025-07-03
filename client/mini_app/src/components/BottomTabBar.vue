<template>
    <nav class="bottom-tab-bar">
      <ul>
        <li v-for="item in navigationItems" :key="item.section">
          <a 
            href="#"
            :class="['nav-link', { active: currentSection === item.section }]"
            @click.prevent="$emit('navigate', item.section)"
          >
            <i :data-feather="item.icon"></i>
            <span>{{ item.title }}</span>
          </a>
        </li>
      </ul>
    </nav>
  </template>
  
  <script>
  import { onMounted, onUpdated, nextTick } from 'vue'
  
  export default {
    name: 'BottomTabBar',
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
        { section: 'teachers', title: 'Учителя', icon: 'user-check' },
        { section: 'children', title: 'Дети', icon: 'smile' },
        { section: 'statistics', title: 'Статистика', icon: 'bar-chart-2' }
      ]
  
      const updateFeather = () => {
        nextTick(() => {
          if (window.feather) {
            window.feather.replace()
          }
        })
      }
  
      onMounted(updateFeather)
      onUpdated(updateFeather)
  
      return {
        navigationItems
      }
    }
  }
  </script>
  