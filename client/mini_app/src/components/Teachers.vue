<template>
    <div class="teachers">
      <div class="section-header">
        <h2>Управление учителями</h2>
        <button class="btn btn-primary" @click="addNewTeacher">
          <i data-feather="plus"></i>
          Добавить учителя
        </button>
      </div>
  
      <div class="card-grid teacher-grid">
        <div
          v-for="teacher in data.teachers"
          :key="teacher.id"
          class="card teacher-card"
        >
          <div class="teacher-photo">
            <img v-if="teacher.photo" :src="teacher.photo" :alt="teacher.name" />
            <span v-else>{{ getInitials(teacher.name) }}</span>
          </div>
          <div class="teacher-info">
            <h4>{{ teacher.name }}</h4>
            <p>Email: {{ teacher.email }}</p>
            <p>Группы: {{ teacher.groups.join(', ') }}</p>
          </div>
          <div class="actions">
            <button class="btn btn-secondary" @click="editTeacher(teacher)">
              Редактировать
            </button>
            <button class="btn btn-danger" @click="deleteTeacher(teacher)">
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
    name: 'Teachers',
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    emits: ['update-data'],
    setup(props, { emit }) {
      const addNewTeacher = () => {
        // Implement add teacher logic
        console.log('Adding new teacher')
      }
  
      const editTeacher = (teacher) => {
        // Implement edit teacher logic
        console.log('Editing teacher:', teacher)
      }
  
      const deleteTeacher = (teacher) => {
        // Implement delete teacher logic
        console.log('Deleting teacher:', teacher)
      }
  
      const getInitials = (name) => {
        if (!name) return ''
        return name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      }
  
      onMounted(() => {
        if (window.feather) {
          window.feather.replace()
        }
      })
  
      return {
        addNewTeacher,
        editTeacher,
        deleteTeacher,
        getInitials
      }
    }
  }
  </script>
  