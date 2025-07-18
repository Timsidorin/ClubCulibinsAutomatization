<template>
  <div class="dashboard">
    <!-- Статистические карточки -->
    <div class="stats-grid mb-4">
      <div class="stat-card">
        <div class="stat-card-inner">
          <div class="stat-icon">
            <i data-feather="users"></i>
          </div>
          <div class="stat-content">
            <h3>Всего групп</h3>
            <p class="stat-number">{{ groups.length }}</p>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-inner">
          <div class="stat-icon">
            <i data-feather="user-check"></i>
          </div>
          <div class="stat-content">
            <h3>Всего учителей</h3>
            <p class="stat-number">{{ teachers.length }}</p>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-inner">
          <div class="stat-icon">
            <i data-feather="smile"></i>
          </div>
          <div class="stat-content">
            <h3>Всего детей</h3>
            <p class="stat-number">{{ children.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Таблица логов -->
    <div class="logs-card">
      <div class="logs-header">
        <h3>Логи операций с балансом</h3>
        <button class="btn-clear-header" @click="clearFilters" title="Очистить фильтры">
          <i data-feather="x"></i>
        </button>
      </div>

      <div class="logs-body">
        <!-- Фильтры -->
        <div class="filters-section">
          <div class="filters-container">
            <div class="filters-grid">
              <div class="filter-group">
                <label class="filter-label">Учитель</label>
                <select class="filter-select" v-model="filters.tgTeacher" @change="applyFiltersImmediate">
                  <option value="">Все</option>
                  <option v-for="teacher in teachers" :key="teacher.uuid" :value="teacher.tgUsername">
                    {{ teacher.PersonalDatum?.name }} {{ teacher.PersonalDatum?.lastName }}
                  </option>
                </select>
              </div>

              <div class="filter-group">
                <label class="filter-label">Ребенок</label>
                <select class="filter-select" v-model="filters.tgChild" @change="applyFiltersImmediate">
                  <option value="">Все</option>
                  <option v-for="child in children" :key="child.uuid" :value="child.tgUsername">
                    {{ child.PersonalDatum?.name }} {{ child.PersonalDatum?.lastName }}
                  </option>
                </select>
              </div>

              <div class="filter-group">
                <label class="filter-label">Операция</label>
                <select class="filter-select" v-model="filters.operation" @change="applyFiltersImmediate">
                  <option value="">Все</option>
                  <option value="true">Начисление</option>
                  <option value="false">Списание</option>
                </select>
              </div>

              <div class="filter-group">
                <label class="filter-label">Сумма</label>
                <div class="amount-filter">
                  <select class="filter-select-small" v-model="filters.equalSign" @change="applyFiltersImmediate">
                    <option value="1">=</option>
                    <option value="2">&lt;</option>
                    <option value="3">&gt;</option>
                  </select>
                  <input
                    type="number"
                    class="filter-input"
                    v-model="filters.summ"
                    placeholder="0"
                    @input="applyFilters"
                  />
                </div>
              </div>

              <div class="filter-group">
                <label class="filter-label">От</label>
                <input
                  type="date"
                  class="filter-input"
                  v-model="filters.startDate"
                  @change="applyFiltersImmediate"
                />
              </div>

              <div class="filter-group">
                <label class="filter-label">До</label>
                <input
                  type="date"
                  class="filter-input"
                  v-model="filters.endDate"
                  @change="applyFiltersImmediate"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Таблица логов -->
        <div class="table-container">
          <div class="table-wrapper">
            <table class="logs-table">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Учитель</th>
                  <th>Ребенок</th>
                  <th>Операция</th>
                  <th class="text-end">Сумма</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in logs" :key="log.uuid">
                  <td data-label="Дата">
                    {{ formatDate(log.createdAt) }}
                  </td>
                  <td data-label="Учитель">
                    <div class="user-info">
                      <strong>{{ log.Teacher?.PersonalDatum?.name }} {{ log.Teacher?.PersonalDatum?.lastName }}</strong>
                      <small>{{ log.Teacher?.tgUsername }}</small>
                    </div>
                  </td>
                  <td data-label="Ребенок">
                    <div class="user-info">
                      <strong>{{ log.Child?.PersonalDatum?.name }} {{ log.Child?.PersonalDatum?.lastName }}</strong>
                      <small>{{ log.Child?.tgUsername }}</small>
                    </div>
                  </td>
                  <td data-label="Операция">
                    <span :class="['operation-badge', log.operation === 'true' ? 'success' : 'danger']">
                      {{ log.operation === 'true' ? 'Начисление' : 'Списание' }}
                    </span>
                  </td>
                  <td data-label="Сумма" class="text-end">
                    <span :class="['amount-value', log.operation === 'true' ? 'positive' : 'negative']">
                      {{ log.operation === 'true' ? '+' : '-' }}{{ log.money }} КК
                    </span>
                  </td>
                </tr>
                <tr v-if="logs.length === 0 && !loading">
                  <td colspan="5" class="empty-state">
                    <div class="empty-content">
                      <i data-feather="inbox"></i>
                      <p>Нет данных для отображения</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Загрузка -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <span>Загрузка логов...</span>
        </div>
      </div>
    </div>

    <!-- Быстрые действия -->
    <div class="quick-actions">
      <button class="action-btn primary" @click="$emit('navigate', 'children')">
        <i data-feather="plus-circle"></i>
        <span>Добавить ребенка</span>
      </button>
      <button class="action-btn primary" @click="$emit('navigate', 'groups')">
        <i data-feather="plus-circle"></i>
        <span>Добавить группу</span>
      </button>
      <button class="action-btn secondary" @click="$emit('navigate', 'teachers')">
        <i data-feather="user-plus"></i>
        <span>Добавить учителя</span>
      </button>
    </div>
  </div>
</template>

<script>
// Скрипт остается без изменений
import { ref, onMounted, onUpdated, nextTick } from 'vue';
import TeachersAPIClient from '../../api/TeachersAPIClient.js';
import ChildrenAPIClient from '../../api/ChildrenAPIClient.js';
import GroupsAPIClient from '../../api/GroupsAPIClient.js';
import BalanceAPIClient from '../../api/BalanceAPIClient.js';
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
    const groups = ref([]);
    const logs = ref([]);
    const loading = ref(false);

    const teachersApiClient = new TeachersAPIClient();
    const childrenApiClient = new ChildrenAPIClient();
    const groupsApiClient = new GroupsAPIClient();
    const balanceApiClient = new BalanceAPIClient();

    const filters = ref({
      tgTeacher: '',
      tgChild: '',
      operation: '',
      summ: '',
      startDate: '',
      endDate: '',
      equalSign: '1'
    });

    let filterTimeout = null;

    const formatDate = (date) => {
      if (!date) return '';
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

    const fetchLogs = async (logsData = null) => {
      loading.value = true;
      try {
        const response = await balanceApiClient.BalanceLogs(logsData);
        console.log('Logs response:', response);

        if (response && response.data && Array.isArray(response.data)) {
          logs.value = response.data;
        } else if (Array.isArray(response)) {
          logs.value = response;
        } else {
          logs.value = [];
        }
      } catch (error) {
        console.error('Ошибка при загрузке логов:', error);
        logs.value = [];
      } finally {
        loading.value = false;
      }
    };

    const applyFilters = () => {
      if (filterTimeout) {
        clearTimeout(filterTimeout);
      }

      filterTimeout = setTimeout(() => {
        const filterData = {};

        if (filters.value.tgTeacher) filterData.tgTeacher = filters.value.tgTeacher;
        if (filters.value.tgChild) filterData.tgChild = filters.value.tgChild;
        if (filters.value.operation) filterData.operation = filters.value.operation;
        if (filters.value.summ) filterData.summ = filters.value.summ;
        if (filters.value.startDate) filterData.startDate = filters.value.startDate;
        if (filters.value.endDate) filterData.endDate = filters.value.endDate;
        if (filters.value.equalSign && filters.value.summ) filterData.equalSign = filters.value.equalSign;

        fetchLogs(filterData);
      }, 300);
    };

    const applyFiltersImmediate = () => {
      const filterData = {};

      if (filters.value.tgTeacher) filterData.tgTeacher = filters.value.tgTeacher;
      if (filters.value.tgChild) filterData.tgChild = filters.value.tgChild;
      if (filters.value.operation) filterData.operation = filters.value.operation;
      if (filters.value.summ) filterData.summ = filters.value.summ;
      if (filters.value.startDate) filterData.startDate = filters.value.startDate;
      if (filters.value.endDate) filterData.endDate = filters.value.endDate;
      if (filters.value.equalSign && filters.value.summ) filterData.equalSign = filters.value.equalSign;
      fetchLogs(filterData);
    };

    const clearFilters = () => {
      filters.value = {
        tgTeacher: '',
        tgChild: '',
        operation: '',
        summ: '',
        startDate: '',
        endDate: '',
        equalSign: '1'
      };
      fetchLogs();
    };

    const fetchTeachers = async () => {
      try {
        const response = await teachersApiClient.getAllTeachers(1);
        let teachersData = [];

        if (response && response.data && response.data.data) {
          teachersData = response.data.data;
        }

        if (Array.isArray(teachersData)) {
          teachers.value = teachersData.map(teacherData => {
            return Teachers.fromApiObject(teacherData);
          });
          emit('teachers-loaded', teachers.value);
        } else {
          teachers.value = [];
        }
      } catch (error) {
        console.error('Ошибка при загрузке учителей:', error);
        teachers.value = [];
      }
    };

    const fetchChildren = async () => {
      try {
        const response = await childrenApiClient.getAllChildren(3);
        let childrenData = [];

        if (response && response.data && response.data.data) {
          childrenData = response.data.data;
        }

        if (Array.isArray(childrenData)) {
          children.value = childrenData;
          emit('children-loaded', children.value);
        } else {
          children.value = [];
        }
      } catch (error) {
        console.error('Ошибка при загрузке детей:', error);
        children.value = [];
      }
    };

    const fetchGroups = async () => {
      try {
        const response = await groupsApiClient.getAllGroups();
        let groupsData = [];
        groupsData = response.message.groups;

        if (Array.isArray(groupsData)) {
          groups.value = groupsData;
          emit('groups-loaded', groups.value);
        } else {
          groups.value = [];
        }
      } catch (error) {
        console.error('Ошибка при загрузке групп:', error);
        groups.value = [];
      }
    };

    onMounted(async () => {
      try {
        updateFeather();
        await fetchTeachers();
        await fetchChildren();
        await fetchGroups();
        await fetchLogs();
      } catch (error) {
        console.error('Ошибка при монтировании компонента:', error);
      }
    });

    onUpdated(() => {
      updateFeather();
    });

    return {
      teachers,
      children,
      groups,
      logs,
      loading,
      filters,
      formatDate,
      applyFilters,
      applyFiltersImmediate,
      clearFilters
    };
  }
};
</script>

<style scoped>
.dashboard {
  padding: 16px;
  max-width: 100%;
  background: var(--tg-bg-color, #f8f9fa);
}

/* Статистические карточки */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--tg-card-bg, #ffffff);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid var(--tg-border, #e9ecef);
  overflow: hidden;
  position: relative;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #0088cc 0%, #28a745 100%);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-card-inner {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e3f2fd 0%, #f8f9fa 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 136, 204, 0.2);
}

.stat-icon i {
  width: 24px;
  height: 24px;
  color: #0088cc;
}

.stat-content h3 {
  font-size: 14px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.stat-number {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #0088cc 0%, #28a745 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

/* Карточка логов */
.logs-card {
  background: var(--tg-card-bg, #ffffff);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--tg-border, #e9ecef);
  overflow: hidden;
  margin-bottom: 24px;
}

.logs-header {
  background: linear-gradient(135deg, #0088cc 0%, #0066aa 100%);
  color: white;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logs-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.btn-clear-header {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-clear-header:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.btn-clear-header i {
  width: 16px;
  height: 16px;
}

.logs-body {
  padding: 24px;
}

/* Фильтры */
.filters-section {
  margin-bottom: 24px;
}

.filters-container {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e9ecef;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-weight: 600;
  color: #495057;
  font-size: 14px;
}

.filter-select,
.filter-input {
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #0088cc;
  box-shadow: 0 0 0 3px rgba(0, 136, 204, 0.1);
}

.amount-filter {
  display: flex;
  gap: 8px;
}

.filter-select-small {
  padding: 10px 8px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  flex: 0 0 60px;
}

.filter-input {
  flex: 1;
}

/* Таблица */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #e9ecef;
}

.table-wrapper {
  overflow-x: auto;
}

.logs-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
}

.logs-table thead th {
  background: linear-gradient(135deg, #0088cc 0%, #0066aa 100%);
  color: white;
  padding: 16px;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: none;
  white-space: nowrap;
}

.logs-table tbody td {
  padding: 16px;
  border-bottom: 1px solid #e9ecef;
  font-size: 14px;
  vertical-align: middle;
}

.logs-table tbody tr:hover {
  background: #f8f9fa;
}

.logs-table tbody tr:last-child td {
  border-bottom: none;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-info strong {
  color: #495057;
  font-weight: 600;
  font-size: 14px;
}

.user-info small {
  color: #6c757d;
  font-size: 12px;
}

.operation-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.operation-badge.success {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.operation-badge.danger {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.amount-value {
  font-weight: 700;
  font-size: 15px;
}

.amount-value.positive {
  color: #28a745;
}

.amount-value.negative {
  color: #dc3545;
}

.text-end {
  text-align: right;
}

/* Состояния */
.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-content i {
  width: 48px;
  height: 48px;
  color: #6c757d;
  opacity: 0.5;
}

.empty-content p {
  color: #6c757d;
  font-size: 16px;
  margin: 0;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: #6c757d;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e9ecef;
  border-top: 3px solid #0088cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Быстрые действия */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
  cursor: pointer;
  text-decoration: none;
}

.action-btn.primary {
  background: linear-gradient(135deg, #0088cc 0%, #0066aa 100%);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 136, 204, 0.3);
}

.action-btn.secondary {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
}

.action-btn.secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(108, 117, 125, 0.3);
}

.action-btn i {
  width: 16px;
  height: 16px;
}

/* Мобильная адаптивность */
@media (max-width: 768px) {
  .dashboard {
    padding: 12px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }

  .stat-card-inner {
    padding: 20px;
    gap: 12px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
  }

  .stat-icon i {
    width: 20px;
    height: 20px;
  }

  .stat-number {
    font-size: 28px;
  }

  .logs-header {
    padding: 16px;
  }

  .logs-header h3 {
    font-size: 16px;
  }

  .logs-body {
    padding: 16px;
  }

  .filters-container {
    padding: 16px;
  }

  .filters-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .quick-actions {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .action-btn {
    padding: 14px 20px;
  }
}

@media (max-width: 640px) {
  .dashboard {
    padding: 8px;
  }

  .stat-card-inner {
    padding: 16px;
  }

  .stat-number {
    font-size: 24px;
  }

  .logs-header {
    padding: 12px;
  }

  .logs-body {
    padding: 12px;
  }

  .filters-container {
    padding: 12px;
  }

  .logs-table thead th,
  .logs-table tbody td {
    padding: 12px 8px;
    font-size: 13px;
  }

  .user-info strong {
    font-size: 13px;
  }

  .user-info small {
    font-size: 11px;
  }

  .operation-badge {
    padding: 4px 8px;
    font-size: 11px;
  }

  .amount-value {
    font-size: 14px;
  }

  .action-btn {
    padding: 12px 16px;
    font-size: 13px;
  }
}

/* Очень маленькие экраны */
@media (max-width: 480px) {
  .dashboard {
    padding: 4px;
  }

  .stats-grid {
    gap: 8px;
  }

  .stat-card-inner {
    padding: 12px;
    gap: 8px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
  }

  .stat-icon i {
    width: 16px;
    height: 16px;
  }

  .stat-number {
    font-size: 20px;
  }

  .logs-header h3 {
    font-size: 14px;
  }

  .btn-clear-header {
    width: 32px;
    height: 32px;
  }

  .btn-clear-header i {
    width: 14px;
    height: 14px;
  }

  .logs-body {
    padding: 8px;
  }

  .filters-container {
    padding: 8px;
  }

  .logs-table thead th,
  .logs-table tbody td {
    padding: 8px 4px;
    font-size: 12px;
  }

  .user-info strong {
    font-size: 12px;
  }

  .user-info small {
    font-size: 10px;
  }

  .operation-badge {
    padding: 3px 6px;
    font-size: 10px;
  }

  .amount-value {
    font-size: 13px;
  }

  .action-btn {
    padding: 10px 12px;
    font-size: 12px;
  }

  .action-btn span {
    display: none;
  }

  .quick-actions {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Альбомная ориентация на мобильных */
@media (max-width: 768px) and (orientation: landscape) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .quick-actions {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Планшеты */
@media (min-width: 769px) and (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .quick-actions {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
