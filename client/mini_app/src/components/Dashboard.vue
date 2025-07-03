<template>
    <div class="dashboard">
      <div class="card-grid">
        <div class="card stat-card">
          <h3>Всего групп</h3>
          <p>{{ data.groups.length }}</p>
        </div>
        <div class="card stat-card">
          <h3>Всего учителей</h3>
          <p>{{ data.teachers.length }}</p>
        </div>
        <div class="card stat-card">
          <h3>Всего детей</h3>
          <p>{{ data.children.length }}</p>
        </div>
      </div>
      
      <div class="card">
        <h3>Последние активности</h3>
        <ul class="activity-feed">
          <li v-for="activity in data.activities" :key="activity.id">
            <span>{{ activity.text }}</span>
            <small>{{ formatDate(activity.timestamp) }}</small>
          </li>
        </ul>
      </div>
      
      <div class="quick-actions">
        <button 
          class="btn btn-primary" 
          @click="$emit('navigate', 'children')"
        >
          <i data-feather="plus-circle"></i> 
          Добавить ребенка
        </button>
        <button 
          class="btn btn-primary" 
          @click="$emit('navigate', 'groups')"
        >
          <i data-feather="plus-circle"></i> 
          Добавить группу
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { onMounted } from 'vue'
  
  export default {
    name: 'Dashboard',
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    emits: ['navigate'],
    setup() {
      const formatDate = (date) => {
        return new Date(date).toLocaleString('ru-RU')
      }
  
      onMounted(() => {
        if (window.feather) {
          window.feather.replace()
        }
      })
  
      return {
        formatDate
      }
    }
  }
  </script>
  