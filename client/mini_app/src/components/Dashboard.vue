<template>
  <div class="dashboard">
    <div class="stats-grid">
      <div class="card stat-card">
        <div class="stat-icon">
          <i data-feather="users"></i>
        </div>
        <div class="stat-content">
          <h3>Всего групп</h3>
          <p class="stat-number">{{ data.groups.length }}</p>
        </div>
      </div>
      <div class="card stat-card">
        <div class="stat-icon">
          <i data-feather="user-check"></i>
        </div>
        <div class="stat-content">
          <h3>Всего учителей</h3>
          <p class="stat-number">{{ teachers.length }}</p>
        </div>
      </div>
      <div class="card stat-card">
        <div class="stat-icon">
          <i data-feather="smile"></i>
        </div>
        <div class="stat-content">
          <h3>Всего детей</h3>
          <p class="stat-number">{{ children.length }}</p>
        </div>
      </div>
    </div>

    <div class="card activity-card">
      <h3>Последние активности</h3>
      <ul class="activity-feed">
        <li v-for="activity in data.activities" :key="activity.id">
          <div class="activity-content">
            <span class="activity-text">{{ activity.text }}</span>
            <small class="activity-time">{{ formatDate(activity.timestamp) }}</small>
          </div>
        </li>
        <li v-if="data.activities.length === 0" class="no-activities">
          <span>Пока нет активностей</span>
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
      <button
        class="btn btn-secondary"
        @click="$emit('navigate', 'teachers')"
      >
        <i data-feather="user-plus"></i>
        Добавить учителя
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUpdated, nextTick } from 'vue';
import TeachersAPIClient from '../../api/TeachersAPIClient.js';
import ChildrenAPIClient from '../../api/ChildrenAPIClient.js';
import { Teachers } from '../../models/Teachers.js';

export default {
  name: 'Dashboard',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  emits: ['navigate', 'teachers-loaded', 'children-loaded'],
  setup(props, { emit }) {
    const teachers = ref([]);
    const children = ref([]);
    const teachersApiClient = new TeachersAPIClient();
    const childrenApiClient = new ChildrenAPIClient();

    const formatDate = (date) => {
      return new Date(date).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const updateFeather = () => {
      nextTick(() => {
        if (window.feather) {
          window.feather.replace();
        }
      });
    };

    // Загрузка списка учителей из API
    const fetchTeachers = async () => {
      try {
        const response = await teachersApiClient.getAllTeachers(1);

        let teachersData = [];
        teachersData = response.data.data;


        if (Array.isArray(teachersData)) {
          teachers.value = teachersData.map(teacherData => {
            return Teachers.fromApiObject(teacherData);
          });
          emit('teachers-loaded', teachers.value);
        } else {
          teachers.value = [];
        }
      } catch (error) {
        teachers.value = [];
      }
    };

    // Загрузка списка детей из API
    const fetchChildren = async () => {
      try {
        const response = await childrenApiClient.getAllChildren(3);

        let childrenData = [];
        childrenData = response.data.data;
        if (Array.isArray(childrenData)) {
          children.value = childrenData;
          emit('children-loaded', children.value);
        } else {
          children.value = [];
        }
      } catch (error) {
        console.error('Ошибка при загрузке детей:', error);
        if (error.response) {
          console.error('Ответ сервера (ошибка):', error.response);
        }
        children.value = [];
      }
    };

    onMounted(() => {
      updateFeather();
      fetchTeachers();
      fetchChildren();
    });

    onUpdated(updateFeather);

    return {
      teachers,
      children,
      formatDate
    };
  }
};
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}


.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: var(--tg-card-bg);
  border-radius: var(--border-radius-card);
  box-shadow: var(--box-shadow-card);
  transition: all var(--transition-speed);
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--tg-blue) 0%, var(--tg-green) 100%);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--box-shadow-hover);
  border-color: var(--tg-blue-light);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--tg-blue-light) 0%, rgba(224, 242, 255, 0.5) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon i {
  width: 28px;
  height: 28px;
  color: var(--tg-blue);
}

.stat-content {
  flex: 1;
  text-align: left;
}

.stat-content h3 {
  font-size: 0.9em;
  font-weight: 600;
  color: var(--tg-text-light);
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  font-size: 2.5em;
  font-weight: 800;
  background: linear-gradient(135deg, var(--tg-blue) 0%, var(--tg-green) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1;
}

/* Карточка активности */
.activity-card {
  background: var(--tg-card-bg);
  border-radius: var(--border-radius-card);
  box-shadow: var(--box-shadow-card);
  padding: 24px;
}

.activity-card h3 {
  color: var(--tg-blue);
  font-size: 1.3em;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.activity-card h3::before {
  content: '';
  width: 4px;
  height: 20px;
  background: linear-gradient(135deg, var(--tg-blue) 0%, var(--tg-green) 100%);
  border-radius: 2px;
}

.activity-feed {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
}

.activity-feed li {
  padding: 12px 0;
  border-bottom: 1px solid var(--tg-border);
  transition: background-color var(--transition-speed);
}

.activity-feed li:last-child {
  border-bottom: none;
}

.activity-feed li:hover {
  background-color: var(--tg-blue-light);
  margin: 0 -12px;
  padding: 12px;
  border-radius: 8px;
}

.activity-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.activity-text {
  font-weight: 500;
  color: var(--tg-text);
  flex: 1;
}

.activity-time {
  color: var(--tg-text-light);
  font-size: 0.85em;
  white-space: nowrap;
  flex-shrink: 0;
}

.no-activities {
  text-align: center;
  color: var(--tg-text-light);
  font-style: italic;
  padding: 40px 0;
}

/* Быстрые действия */
.quick-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  border: none;
  border-radius: var(--border-radius-button);
  cursor: pointer;
  font-size: 0.95em;
  font-weight: 600;
  transition: all var(--transition-speed);
  text-decoration: none;
  justify-content: center;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn:hover::before {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, var(--tg-blue) 0%, var(--tg-blue-dark) 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 136, 204, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 136, 204, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, var(--tg-secondary) 0%, #5a6268 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(108, 117, 125, 0.4);
}

/* Адаптивные медиа-запросы */

/* Большие экраны (Desktop) */
@media (min-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .stat-card {
    padding: 28px;
  }

  .stat-number {
    font-size: 3em;
  }
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-number {
    font-size: 2.2em;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
  }

  .stat-icon i {
    width: 24px;
    height: 24px;
  }
}

/* Планшеты (Tablet portrait) */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .stat-card {
    padding: 18px;
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .stat-content {
    text-align: center;
  }

  .stat-number {
    font-size: 2em;
  }

  .quick-actions {
    flex-direction: column;
    gap: 12px;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .activity-content {
    flex-direction: column;
    gap: 8px;
  }

  .activity-time {
    align-self: flex-start;
  }
}

/* Мобильные устройства */
@media (max-width: 480px) {
  .dashboard {
    gap: 16px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }

  .stat-card {
    padding: 16px;
    flex-direction: row;
    text-align: left;
    gap: 16px;
  }

  .stat-content {
    text-align: left;
  }

  .stat-content h3 {
    font-size: 0.8em;
  }

  .stat-number {
    font-size: 1.8em;
  }

  .stat-icon {
    width: 45px;
    height: 45px;
  }

  .stat-icon i {
    width: 20px;
    height: 20px;
  }

  .activity-card {
    padding: 16px;
  }

  .activity-card h3 {
    font-size: 1.1em;
  }

  .btn {
    padding: 12px 20px;
    font-size: 0.9em;
  }
}


@media (max-width: 360px) {
  .stat-card {
    padding: 12px;
    gap: 12px;
  }

  .stat-number {
    font-size: 1.6em;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
  }

  .stat-icon i {
    width: 18px;
    height: 18px;
  }
}
</style>
