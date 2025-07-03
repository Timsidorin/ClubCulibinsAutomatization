<template>
  <div class="groups">
    <div class="section-header">
      <div class="header-content">
        <h2>Управление группами</h2>
      </div>
      <button class="btn btn-primary" @click="addNewGroup">
        <i data-feather="plus"></i>
        Добавить группу
      </button>
    </div>

    <div class="groups-grid" v-if="data.groups && data.groups.length > 0">
      <div
        v-for="group in data.groups"
        :key="group.id"
        class="group-card"
      >
        <div class="group-header">
          <div class="group-icon">
            <i data-feather="users"></i>
          </div>
          <div class="group-info">
            <h4 class="group-name">{{ group.name }}</h4>
            <span class="group-status">Активная</span>
          </div>
        </div>

        <div class="group-stats">
          <div class="stat-item">
            <i data-feather="user"></i>
            <span class="stat-label">Учеников:</span>
            <span class="stat-value">{{ group.studentsCount }}</span>
          </div>
          <div class="stat-item">
            <i data-feather="user-check"></i>
            <span class="stat-label">Учитель:</span>
            <span class="stat-value">{{ group.teacher }}</span>
          </div>
        </div>

        <div class="group-actions">
          <button class="btn btn-secondary" @click="editGroup(group)">
            <i data-feather="edit-2"></i>
            Редактировать
          </button>
          <button class="btn btn-danger" @click="deleteGroup(group)">
            <i data-feather="trash-2"></i>
            Удалить
          </button>
        </div>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div class="empty-state" v-else>
      <div class="empty-icon">
        <i data-feather="users"></i>
      </div>
      <h3>Пока нет групп</h3>
      <p>Создайте первую группу для начала работы</p>
      <button class="btn btn-primary" @click="addNewGroup">
        <i data-feather="plus"></i>
        Создать первую группу
      </button>
    </div>
  </div>
</template>

<script>
import { onMounted, onUpdated, nextTick } from 'vue'

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
      const newGroup = {
        id: Date.now(),
        name: `Группа ${props.data.groups.length + 1}`,
        studentsCount: 0,
        teacher: 'Не назначен'
      }

      const updatedGroups = [...props.data.groups, newGroup]
      emit('update-data', { groups: updatedGroups })
    }

    const editGroup = (group) => {
      console.log('Editing group:', group)
    }

    const deleteGroup = (group) => {
      if (confirm(`Вы уверены, что хотите удалить группу "${group.name}"?`)) {
        const updatedGroups = props.data.groups.filter(g => g.id !== group.id)
        emit('update-data', { groups: updatedGroups })
      }
    }

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
      addNewGroup,
      editGroup,
      deleteGroup
    }
  }
}
</script>

<style scoped>
.groups {
  width: 100%;
  max-width: none;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: var(--tg-card-bg);
  border-radius: var(--border-radius-card);
  box-shadow: var(--box-shadow-card);
  margin-bottom: 24px;
  width: 100%;
}

.header-content {
  flex: 1;
  min-width: 0;
}

.header-content h2 {
  font-size: 1.8em;
  font-weight: 700;
  color: var(--tg-blue);
  margin: 0;
}

.groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: none;
}

.group-card {
  background: var(--tg-card-bg);
  border-radius: var(--border-radius-card);
  box-shadow: var(--box-shadow-card);
  padding: 24px;
  transition: all var(--transition-speed);
  border-left: 4px solid var(--tg-blue);
}

.group-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.group-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.group-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--tg-blue-light);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.group-icon i {
  width: 24px;
  height: 24px;
  color: var(--tg-blue);
}

.group-info {
  flex: 1;
  min-width: 0;
}

.group-name {
  font-size: 1.2em;
  font-weight: 600;
  color: var(--tg-text);
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.group-status {
  font-size: 0.8em;
  color: var(--tg-green);
  background: rgba(40, 167, 69, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.group-stats {
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 0.9em;
}

.stat-item i {
  width: 16px;
  height: 16px;
  color: var(--tg-text-light);
  flex-shrink: 0;
}

.stat-label {
  color: var(--tg-text-light);
  min-width: 70px;
}

.stat-value {
  color: var(--tg-text);
  font-weight: 500;
}

.group-actions {
  display: flex;
  gap: 10px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: var(--border-radius-button);
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 600;
  transition: all var(--transition-speed);
  flex: 1;
  justify-content: center;
  white-space: nowrap;
}

.btn-primary {
  background: var(--tg-blue);
  color: white;
}

.btn-primary:hover {
  background: #007bbd;
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--tg-secondary);
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

.btn-danger {
  background: var(--tg-red);
  color: white;
}

.btn-danger:hover {
  background: #c82333;
  transform: translateY(-1px);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: var(--tg-card-bg);
  border-radius: var(--border-radius-card);
  box-shadow: var(--box-shadow-card);
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--tg-blue-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.empty-icon i {
  width: 40px;
  height: 40px;
  color: var(--tg-blue);
}

.empty-state h3 {
  font-size: 1.3em;
  color: var(--tg-text);
  margin: 0 0 8px 0;
}

.empty-state p {
  color: var(--tg-text-light);
  margin: 0 0 24px 0;
}

/* Адаптивность */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding: 20px;
  }

  .groups-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .group-card {
    padding: 20px;
  }

  .group-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .section-header {
    padding: 16px;
  }

  .header-content h2 {
    font-size: 1.5em;
  }

  .group-card {
    padding: 16px;
  }

  .group-header {
    gap: 12px;
  }

  .group-icon {
    width: 40px;
    height: 40px;
  }

  .group-icon i {
    width: 20px;
    height: 20px;
  }

  .group-name {
    font-size: 1.1em;
  }

  .empty-state {
    padding: 40px 16px;
  }

  .empty-icon {
    width: 60px;
    height: 60px;
  }

  .empty-icon i {
    width: 30px;
    height: 30px;
  }
}
</style>
