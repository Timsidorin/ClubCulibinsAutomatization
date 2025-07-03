<template>
    <div class="groups">
      <div class="section-header">
        <h2>Управление группами</h2>
        <button class="btn btn-primary" @click="addNewGroup">
          <i data-feather="plus"></i> 
          Добавить новую группу
        </button>
      </div>
      
      <div class="card-grid group-grid">
        <div 
          v-for="group in data.groups" 
          :key="group.id" 
          class="card group-card"
        >
          <h4>{{ group.name }}</h4>
          <p>Учеников: {{ group.studentsCount }}</p>
          <p>Учитель: {{ group.teacher }}</p>
          <div class="actions">
            <button class="btn btn-secondary" @click="editGroup(group)">
              Редактировать
            </button>
            <button class="btn btn-danger" @click="deleteGroup(group)">
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { onMounted } from 'vue'
  
  export default {
    name: 'Groups',
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    emits: ['update-data'],
    setup(props, { emit }) {
      const addNewGroup = () => {
        // Implement add group logic
        console.log('Adding new group')
      }
  
      const editGroup = (group) => {
        // Implement edit group logic
        console.log('Editing group:', group)
      }
  
      const deleteGroup = (group) => {
        // Implement delete group logic
        console.log('Deleting group:', group)
      }
  
      onMounted(() => {
        if (window.feather) {
          window.feather.replace()
        }
      })
  
      return {
        addNewGroup,
        editGroup,
        deleteGroup
      }
    }
  }
  </script>
  