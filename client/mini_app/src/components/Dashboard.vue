<template>
  <div class="dashboard">
    <!-- Статистические карточки -->
    <div class="row g-3 mb-4">
      <div class="col-md-4 col-sm-6">
        <div class="card stat-card h-100">
          <div class="card-body d-flex flex-column align-items-center justify-content-center text-center">
            <div class="stat-icon mb-2">
              <i data-feather="users"></i>
            </div>
            <div class="stat-content">
              <h3 class="mb-2">Всего групп</h3>
              <p class="stat-number mb-0">{{ groups.length }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-sm-6">
        <div class="card stat-card h-100">
          <div class="card-body d-flex flex-column align-items-center justify-content-center text-center">
            <div class="stat-icon mb-2">
              <i data-feather="user-check"></i>
            </div>
            <div class="stat-content">
              <h3 class="mb-2">Всего учителей</h3>
              <p class="stat-number mb-0">{{ teachers.length }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-sm-6">
        <div class="card stat-card h-100">
          <div class="card-body d-flex flex-column align-items-center justify-content-center text-center">
            <div class="stat-icon mb-2">
              <i data-feather="smile"></i>
            </div>
            <div class="stat-content">
              <h3 class="mb-2">Всего детей</h3>
              <p class="stat-number mb-0">{{ children.length }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Таблица логов -->
    <div class="card logs-card">
      <div class="card-header logs-header d-flex justify-content-between align-items-center">
        <h3 class="mb-0">Логи операций с балансом</h3>
        <button class="btn btn-clear-header" @click="clearFilters" title="Очистить фильтры">
          <i data-feather="x"></i>
        </button>
      </div>

      <div class="card-body">
        <!-- Фильтры -->
        <div class="filters-section mb-3">
          <div class="filters-container p-3 rounded">
            <div class="row g-2 mb-2">
              <div class="col-md-3 col-sm-6">
                <div class="filter-group">
                  <label class="form-label">Учитель</label>
                  <select class="form-select form-select-sm" v-model="filters.tgTeacher" @change="applyFiltersImmediate">
                    <option value="">Все</option>
                    <option v-for="teacher in teachers" :key="teacher.uuid" :value="teacher.tgUsername">
                      {{ teacher.PersonalDatum?.name }} {{ teacher.PersonalDatum?.lastName }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="col-md-3 col-sm-6">
                <div class="filter-group">
                  <label class="form-label">Ребенок</label>
                  <select class="form-select form-select-sm" v-model="filters.tgChild" @change="applyFiltersImmediate">
                    <option value="">Все</option>
                    <option v-for="child in children" :key="child.uuid" :value="child.tgUsername">
                      {{ child.PersonalDatum?.name }} {{ child.PersonalDatum?.lastName }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="col-md-3 col-sm-6">
                <div class="filter-group">
                  <label class="form-label">Операция</label>
                  <select class="form-select form-select-sm" v-model="filters.operation" @change="applyFiltersImmediate">
                    <option value="">Все</option>
                    <option value="true">Начисление</option>
                    <option value="false">Списание</option>
                  </select>
                </div>
              </div>

              <div class="col-md-3 col-sm-6">
                <div class="filter-group">
                  <label class="form-label">Сумма</label>
                  <div class="input-group input-group-sm">
                    <select class="form-select" v-model="filters.equalSign" @change="applyFiltersImmediate" style="max-width: 60px;">
                      <option value="1">=</option>
                      <option value="2">&lt;</option>
                      <option value="3">&gt;</option>
                    </select>
                    <input
                      type="number"
                      class="form-control"
                      v-model="filters.summ"
                      placeholder="0"
                      @input="applyFilters"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="row g-2">
              <div class="col-md-6 col-sm-6">
                <div class="filter-group">
                  <label class="form-label">От</label>
                  <input
                    type="date"
                    class="form-control form-control-sm"
                    v-model="filters.startDate"
                    @change="applyFiltersImmediate"
                  />
                </div>
              </div>

              <div class="col-md-6 col-sm-6">
                <div class="filter-group">
                  <label class="form-label">До</label>
                  <input
                    type="date"
                    class="form-control form-control-sm"
                    v-model="filters.endDate"
                    @change="applyFiltersImmediate"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Таблица логов -->
        <div class="table-responsive">
          <table class="table table-hover logs-table">
            <thead class="table-primary">
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
                <td>
                  <small class="text-muted d-block d-sm-none">Дата:</small>
                  {{ formatDate(log.createdAt) }}
                </td>
                <td>
                  <small class="text-muted d-block d-sm-none">Учитель:</small>
                  <div class="user-info">
                    <strong>{{ log.Teacher?.PersonalDatum?.name }} {{ log.Teacher?.PersonalDatum?.lastName }}</strong>
                    <small class="text-muted">{{ log.Teacher?.tgUsername }}</small>
                  </div>
                </td>
                <td>
                  <small class="text-muted d-block d-sm-none">Ребенок:</small>
                  <div class="user-info">
                    <strong>{{ log.Child?.PersonalDatum?.name }} {{ log.Child?.PersonalDatum?.lastName }}</strong>
                    <small class="text-muted">{{ log.Child?.tgUsername }}</small>
                  </div>
                </td>
                <td>
                  <small class="text-muted d-block d-sm-none">Операция:</small>
                  <span :class="['badge', 'operation-badge', log.operation === 'true' ? 'bg-success' : 'bg-danger']">
                    {{ log.operation === 'true' ? 'Начисление' : 'Списание' }}
                  </span>
                </td>
                <td class="text-end">
                  <small class="text-muted d-block d-sm-none">Сумма:</small>
                  <span :class="['amount-value', 'fw-bold', log.operation === 'true' ? 'text-success' : 'text-danger']">
                    {{ log.operation === 'true' ? '+' : '-' }}{{ log.money }} КК
                  </span>
                </td>
              </tr>
              <tr v-if="logs.length === 0 && !loading">
                <td colspan="5" class="text-center py-4">
                  <div class="empty-state">
                    <i data-feather="inbox" class="mb-2"></i>
                    <p class="text-muted mb-0">Нет данных для отображения</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Загрузка -->
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary me-2" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
          <span class="text-muted">Загрузка логов...</span>
        </div>
      </div>
    </div>

    <!-- Быстрые действия -->
    <div class="row g-2 mt-3">
      <div class="col-md-4 col-sm-6">
        <button
          class="btn btn-primary w-100"
          @click="$emit('navigate', 'children')"
        >
          <i data-feather="plus-circle" class="me-2"></i>
          Добавить ребенка
        </button>
      </div>
      <div class="col-md-4 col-sm-6">
        <button
          class="btn btn-primary w-100"
          @click="$emit('navigate', 'groups')"
        >
          <i data-feather="plus-circle" class="me-2"></i>
          Добавить группу
        </button>
      </div>
      <div class="col-md-4 col-sm-6">
        <button
          class="btn btn-secondary w-100"
          @click="$emit('navigate', 'teachers')"
        >
          <i data-feather="user-plus" class="me-2"></i>
          Добавить учителя
        </button>
      </div>
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
  padding: 0 8px;
  max-width: 100%;
}

/* Статистические карточки */
.stat-card {
  background: var(--tg-card-bg, #ffffff);
  border-radius: var(--border-radius-card, 12px);
  box-shadow: var(--box-shadow-card, 0 2px 8px rgba(0, 0, 0, 0.1));
  transition: all var(--transition-speed, 0.3s);
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
  min-height: 140px;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--tg-blue, #0088cc) 0%, var(--tg-green, #28a745) 100%);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--box-shadow-hover, 0 4px 16px rgba(0, 0, 0, 0.15));
  border-color: var(--tg-blue-light, #e0f2ff);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--tg-blue-light, #e0f2ff) 0%, rgba(224, 242, 255, 0.5) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon i {
  width: 20px;
  height: 20px;
  color: var(--tg-blue, #0088cc);
}

.stat-content h3 {
  font-size: 0.8em;
  font-weight: 600;
  color: var(--tg-text-light, #6c757d);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.stat-number {
  font-size: 1.8em;
  font-weight: 800;
  background: linear-gradient(135deg, var(--tg-blue, #0088cc) 0%, var(--tg-green, #28a745) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

/* Карточка логов */
.logs-card {
  background: var(--tg-card-bg, #ffffff);
  border-radius: var(--border-radius-card, 12px);
  box-shadow: var(--box-shadow-card, 0 2px 8px rgba(0, 0, 0, 0.1));
  border: 1px solid var(--tg-border, #dee2e6);
}

.logs-header {
  background: var(--tg-blue-light, #e0f2ff);
  border-bottom: 1px solid var(--tg-border, #dee2e6);
}

.logs-header h3 {
  color: var(--tg-blue, #0088cc);
  font-size: 1.2em;
  font-weight: 600;
}

.btn-clear-header {
  background: var(--tg-red, #dc3545);
  color: white;
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-clear-header:hover {
  background: #c82333;
  transform: scale(1.05);
}

.btn-clear-header i {
  width: 14px;
  height: 14px;
}

/* Фильтры */
.filters-container {
  background: var(--tg-blue-light, #e0f2ff);
  border: 1px solid var(--tg-border, #dee2e6);
}

.filter-group label {
  font-weight: 600;
  color: var(--tg-text, #212529);
  font-size: 0.75em;
}

/* Таблица */
.logs-table {
  margin-bottom: 0;
}

.logs-table thead th {
  background: var(--tg-blue, #0088cc) !important;
  color: white;
  font-weight: 600;
  font-size: 0.8em;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border: none;
}

.logs-table tbody tr:hover {
  background: var(--tg-blue-light, #e0f2ff);
}

.logs-table td {
  vertical-align: middle;
  font-size: 0.85em;
  border-bottom: 1px solid var(--tg-border, #dee2e6);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-info strong {
  color: var(--tg-text, #212529);
  font-weight: 600;
  font-size: 0.85em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

.user-info small {
  font-size: 0.7em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

.operation-badge {
  font-size: 0.7em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  white-space: nowrap;
}

.amount-value {
  font-size: 0.9em;
  white-space: nowrap;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-state i {
  width: 40px;
  height: 40px;
  opacity: 0.5;
}

/* Адаптивность */
@media (max-width: 768px) {
  .dashboard {
    padding: 0 4px;
  }

  .stat-card {
    min-height: 100px;
  }

  .stat-icon {
    width: 32px;
    height: 32px;
  }

  .stat-icon i {
    width: 16px;
    height: 16px;
  }

  .stat-content h3 {
    font-size: 0.7em;
  }

  .stat-number {
    font-size: 1.5em;
  }

  .logs-header h3 {
    font-size: 1.1em;
  }

  .btn-clear-header {
    width: 28px;
    height: 28px;
  }

  .btn-clear-header i {
    width: 12px;
    height: 12px;
  }

  .logs-table td {
    font-size: 0.75em;
  }

  .user-info strong {
    font-size: 0.75em;
    max-width: 120px;
  }

  .user-info small {
    font-size: 0.65em;
    max-width: 120px;
  }
}

@media (max-width: 576px) {
  .dashboard {
    padding: 0 2px;
  }

  .stat-card {
    min-height: 80px;
  }

  .stat-icon {
    width: 24px;
    height: 24px;
  }

  .stat-icon i {
    width: 12px;
    height: 12px;
  }

  .stat-content h3 {
    font-size: 0.65em;
  }

  .stat-number {
    font-size: 1.3em;
  }

  .logs-table td {
    font-size: 0.7em;
  }

  .user-info strong {
    max-width: 100px;
  }

  .user-info small {
    max-width: 100px;
  }
}
</style>
