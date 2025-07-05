<template>
    <div class="children">
      <div class="section-header">
        <h2>Управление детьми</h2>
      </div>
      
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Поиск по имени ребенка..."
          @input="filterChildren"
        >
        <button class="btn btn-primary">
          <i data-feather="search"></i> 
          Поиск
        </button>
      </div>
      
      <div class="bulk-actions-toolbar" v-if="selectedChildren.length > 0">
        <button class="btn btn-success" @click="distributeCoins">
          <i data-feather="dollar-sign"></i> 
          Выдать монеты выбранным ({{ selectedChildren.length }})
        </button>
      </div>
      
      <div class="children-list">
        <div 
          v-for="child in filteredChildren" 
          :key="child.id" 
          class="child-item"
        >
          <input 
            type="checkbox" 
            :value="child.id"
            v-model="selectedChildren"
          >
          <div class="child-details">
            <h4>{{ child.name }}</h4>
            <p>Группа: {{ child.group }}</p>
          </div>
          <div class="child-coins">
            {{ child.coins }} 🪙
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue'
  
  export default {
    name: 'Children',
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    emits: ['update-data'],
    setup(props) {
      const searchQuery = ref('')
      const selectedChildren = ref([])
  
      const filteredChildren = computed(() => {
        if (!searchQuery.value) {
          return props.data.children
        }
        return props.data.children.filter(child =>
          child.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      })
  
      const filterChildren = () => {
        // Filtering is handled by computed property
      }
  
      const distributeCoins = () => {
        console.log('Distributing coins to:', selectedChildren.value)
      }
  
      onMounted(() => {
        if (window.feather) {
          window.feather.replace()
        }
      })
  
      return {
        searchQuery,
        selectedChildren,
        filteredChildren,
        filterChildren,
        distributeCoins
      }
    }
  }
  </script>
  