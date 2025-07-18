<template>
  <div class="children">
    <div class="section-header">
      <h2>Управление детьми</h2>
      <button class="btn btn-primary" @click="openAddChildModal" :disabled="isLoading">
        <i data-feather="plus"></i>
        Добавить ребенка
      </button>
    </div>

    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Поиск ребенка...">
    </div>

    <div class="bulk-actions-toolbar" v-if="selectedChildren.length > 0">
      <button class="btn btn-success" @click="distributeCoins" :disabled="isLoading">
        <i data-feather="dollar-sign"></i>
        Выдать монеты выбранным ({{ selectedChildren.length }})
      </button>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Загрузка данных...</p>
    </div>

    <div v-else class="children-list">
      <div v-for="child in filteredChildren" :key="child.id" class="child-item">
        <input type="checkbox" :value="child.id" v-model="selectedChildren">
        <div class="child-details">
          <h4>
            {{ child.lastName }}  {{ child.name }}  {{ child.secondName }}
            <span class="child-age">({{ getAge(child.dateOfBirth) }} лет)</span>
          </h4>
          <p>
            Группа: {{ child.group || '—' }}<br>
            Telegram: <span v-if="child.tgUsername">{{ child.tgUsername }}</span><span v-else>—</span><br>
            Телефон: <span v-if="child.phoneNumber">{{ child.phoneNumber }}</span><span v-else>—</span><br>
            Дата рождения: <span v-if="child.dateOfBirth">{{ child.dateOfBirth }}</span><span v-else>—</span>
          </p>
        </div>
        <div class="child-coins">{{ child.coins }} КК</div>
        <div class="actions-overlay">
          <button class="btn btn-secondary" @click="editChild(child)" :disabled="isLoading">
            <i data-feather="edit-2"></i>
            Редактировать
          </button>
          <button class="btn btn-danger" @click="deleteChild(child)" :disabled="isLoading">
            <i data-feather="trash-2"></i>
            Удалить
          </button>
        </div>
      </div>
    </div>

    <div class="empty-state" v-if="!isLoading && filteredChildren.length === 0">
      <div class="empty-icon"><i data-feather="user-check"></i></div>
      <h3>Пока нет детей</h3>
      <p>Добавьте первого ребенка для начала работы</p>
      <button class="btn btn-primary" @click="openAddChildModal" :disabled="isLoading">
        <i data-feather="plus"></i>
        Добавить первого ребенка
      </button>
    </div>

    <div v-if="showModal" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditing ? 'Редактировать ребенка' : 'Добавить нового ребенка' }}</h3>
          <button class="close-btn" @click="closeModal"><i data-feather="x"></i></button>
        </div>
        <form @submit.prevent="submitChild" class="child-form">
         <div class="form-group">
            <label for="lastName">Фамилия *</label>
            <input id="lastName" v-model="newChild.lastName" type="text" class="form-input" required>
          </div>
          <div class="form-group">
            <label for="name">Имя *</label>
            <input id="name" v-model="newChild.name" type="text" class="form-input" required>
          </div>
          <div class="form-group">
            <label for="secondName">Отчество</label>
            <input id="secondName" v-model="newChild.secondName" type="text" class="form-input">
          </div>
          <div class="form-group">
            <label for="tgUsername">Telegram Username</label>
            <input id="tgUsername" v-model="newChild.tgUsername" type="text" class="form-input" placeholder="@username">
          </div>
          <div class="form-group">
            <label for="phoneNumber">Телефон</label>
            <input id="phoneNumber" v-model="newChild.phoneNumber" type="text" class="form-input" placeholder="+7...">
          </div>
          <div class="form-group">
            <label for="dateOfBirth">Дата рождения *</label>
            <input id="dateOfBirth" v-model="newChild.dateOfBirth" type="date" class="form-input" required>
            <span v-if="newChild.dateOfBirth" class="child-age-modal">({{ getAge(newChild.dateOfBirth) }} лет)</span>
          </div>
          <div class="form-group">
            <label for="note">Заметка</label>
            <input id="note" v-model="newChild.note" type="text" class="form-input" placeholder="Дополнительная информация">
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal">Отмена</button>
            <button type="submit" class="btn btn-primary" :disabled="!isChildFormValid || isLoading">
              {{ isEditing ? 'Сохранить изменения' : 'Добавить' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed, onMounted, onUpdated, nextTick } from 'vue';
import ChildrenAPIClient from '../../api/ChildrenAPIClient.js';
import BalanceAPIClient from '../../api/BalanceAPIClient.js';

export default {
  name: 'Children',
  props: {
    data: { type: Object, required: true }
  },
  emits: ['update-data'],
  setup(props, { emit }) {
    const apiClient = new ChildrenAPIClient();
    const balanceApiClient = new BalanceAPIClient();
    const searchQuery = ref('');
    const selectedChildren = ref([]);
    const showModal = ref(false);
    const isEditing = ref(false);
    const isLoading = ref(false);
    const errorMessage = ref('');
    const children = ref([]);
    const currentChildTgUsername = ref(null);
    const newChild = ref({
      tgUsername: '',
      name: '',
      lastName: '',
      secondName: '',
      phoneNumber: '',
      dateOfBirth: '',
      note: ''
    });

    const filteredChildren = computed(() => {
      if (!searchQuery.value) return children.value;
      return children.value.filter(child =>
        `${child.name} ${child.lastName || ''} ${child.secondName || ''}`
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      );
    });

    const isChildFormValid = computed(() =>
      newChild.value.name.trim() &&
      newChild.value.lastName.trim() &&
      newChild.value.dateOfBirth
    );

    const getAge = (dateString) => {
      if (!dateString) return '';
      const today = new Date();
      const dob = new Date(dateString);
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
      return age;
    };

    const loadChildren = async () => {
      isLoading.value = true;
      errorMessage.value = '';
      try {
        const [childrenResponse, balancesResponse] = await Promise.all([
          apiClient.getAllChildren(3),
          balanceApiClient.ChildBalanceGet()
        ]);

        let childrenData = [];
        if (childrenResponse?.data?.data && Array.isArray(childrenResponse.data.data)) {
          childrenData = childrenResponse.data.data;
        } else {
          throw new Error('Получены некорректные данные детей от сервера.');
        }

        let balancesData = [];
        if (Array.isArray(balancesResponse.message)) {
          balancesData = balancesResponse.message;
        } else {
            console.warn('Не удалось получить массив балансов. Ответ API:', balancesResponse);
        }

        const balanceMap = new Map();
        balancesData.forEach(balanceEntry => {
          const username = balanceEntry.User?.tgUsername;
          if (username) {
            balanceMap.set(username.replace('@', ''), balanceEntry.money);
          }
        });

        children.value = childrenData.map(childData => {
          const username = childData.tgUsername ? childData.tgUsername.replace('@', '') : null;
          const balance = username ? balanceMap.get(username) || 0 : 0;

          return {
            id: childData.uuid,
            tgUsername: childData.tgUsername || '',
            name: childData.PersonalDatum?.name || '',
            lastName: childData.PersonalDatum?.lastName || '',
            secondName: childData.PersonalDatum?.secondName || '',
            phoneNumber: childData.PersonalDatum?.phoneNumber || '',
            dateOfBirth: childData.PersonalDatum?.dateOfBirth ? childData.PersonalDatum.dateOfBirth.split('T')[0] : '',
            coins: balance,
            group: childData.group || '—'
          };
        });

      } catch (error) {
        errorMessage.value = `Не удалось загрузить список детей. ${error.message}`;
        children.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    const openAddChildModal = () => {
      showModal.value = true;
      isEditing.value = false;
      currentChildTgUsername.value = null;
      Object.assign(newChild.value, {
        tgUsername: '', name: '', lastName: '', secondName: '',
        phoneNumber: '', dateOfBirth: '', note: ''
      });
    };

    const editChild = (child) => {
      isEditing.value = true;
      currentChildTgUsername.value = child.tgUsername;
      Object.assign(newChild.value, { ...child, note: '' });
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const submitChild = async () => {
      if (!isChildFormValid.value) return;
      isLoading.value = true;
      errorMessage.value = '';
      try {
        const childData = {
          tgUsername: newChild.value.tgUsername || '',
          name: newChild.value.name,
          lastName: newChild.value.lastName,
          secondName: newChild.value.secondName || '',
          typeUser: 3,
          phoneNumber: newChild.value.phoneNumber || '',
          dateOfBirth: newChild.value.dateOfBirth,
          note: newChild.value.note || ' '
        };
        if (isEditing.value && currentChildTgUsername.value) {
          await apiClient.updateChild(currentChildTgUsername.value, childData);
        } else {
          await apiClient.createChild(childData);
        }
        closeModal();
        await loadChildren();
      } catch (error) {
        if (error.response) {
          errorMessage.value = `Ошибка: ${error.response.data?.message || 'Не удалось сохранить данные ребенка.'}`;
        }
      } finally {
        isLoading.value = false;
      }
    };

    const deleteChild = async (child) => {
      if (!child.tgUsername) {
        alert('Нет tgUsername для удаления');
        return;
      }
      if (confirm(`Вы уверены, что хотите удалить ребенка "${child.name} ${child.lastName}"?`)) {
        isLoading.value = true;
        errorMessage.value = '';
        try {
          await apiClient.deleteChild(child.tgUsername);
          await loadChildren();
        } catch (error) {
          if (error.response) console.error('Ответ сервера (ошибка удаления):', error.response);
          errorMessage.value = 'Не удалось удалить ребенка. Попробуйте снова.';
        } finally {
          isLoading.value = false;
        }
      }
    };

    const filterChildren = () => {};
    const distributeCoins = () => {};

    const updateFeather = () => {
      nextTick(() => {
        if (window.feather) {
          window.feather.replace();
        }
      });
    };

    const initializeTelegram = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
      }
    };

    onMounted(() => {
      initializeTelegram();
      loadChildren();
      updateFeather();
    });

    onUpdated(updateFeather);

    return {
      searchQuery, selectedChildren, filteredChildren, filterChildren, distributeCoins,
      showModal, isEditing, openAddChildModal, closeModal, newChild, isChildFormValid,
      submitChild, editChild, deleteChild, getAge, isLoading, errorMessage,
      children
    };
  }
};
</script>

<style scoped>
.children {
  width: 100%;
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
}

.section-header h2 {
  font-size: 1.8em;
  font-weight: 700;
  color: var(--tg-blue);
  margin: 0;
}

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.search-bar input {
  flex: 1;
  padding: 10px 16px;
  border-radius: var(--border-radius-button);
  border: 2px solid var(--tg-border);
  font-size: 1em;
}

.bulk-actions-toolbar {
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
}

.children-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.child-item {
  display: flex;
  align-items: center;
  gap: 18px;
  background: var(--tg-card-bg);
  border-radius: var(--border-radius-card);
  box-shadow: var(--box-shadow-card);
  padding: 18px 24px;
  position: relative;
}

.child-item input[type="checkbox"] {
  margin-right: 8px;
}

.child-details {
  flex: 1;
  min-width: 0;
}

.child-details h4 {
  font-size: 1.1em;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: var(--tg-text);
  display: inline;
}

.child-age, .child-age-modal {
  font-size: 0.95em;
  color: var(--tg-text-light);
  margin-left: 8px;
}

.child-details p {
  margin: 0;
  color: var(--tg-text-light);
  font-size: 0.95em;
  line-height: 1.6;
}

.child-coins {
  font-size: 1.1em;
  font-weight: 600;
  color: var(--tg-blue);
  white-space: nowrap;
}

.actions-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
  padding: 10px;
  z-index: 2;
  border-radius: var(--border-radius-card);
}

.child-item:hover .actions-overlay {
  opacity: 1;
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--tg-card-bg);
  border-radius: var(--border-radius-card);
  box-shadow: var(--box-shadow-hover);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--tg-border);
}

.modal-header h3 {
  color: var(--tg-blue);
  font-size: 1.3em;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color var(--transition-speed);
}

.close-btn:hover {
  background-color: var(--tg-blue-light);
}

.close-btn i {
  width: 20px;
  height: 20px;
  color: var(--tg-text-light);
}

.child-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: var(--tg-text);
  margin-bottom: 6px;
  font-size: 0.9em;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--tg-border);
  border-radius: var(--border-radius-button);
  font-size: 1em;
  outline: none;
  transition: border-color var(--transition-speed);
  background: var(--tg-card-bg);
  color: var(--tg-text);
}

.form-input:focus {
  border-color: var(--tg-blue);
}

.form-input::placeholder {
  color: var(--tg-text-light);
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--tg-border);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: var(--border-radius-button);
  cursor: pointer;
  font-size: 0.85em;
  font-weight: 600;
  transition: background-color var(--transition-speed);
  justify-content: center;
  white-space: nowrap;
}

.btn-primary {
  background: var(--tg-blue);
  color: white;
}

.btn-primary:hover {
  background: #007bbd;
}

.btn-secondary {
  background: var(--tg-secondary);
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-success {
  background: var(--tg-green);
  color: white;
}

.btn-success:hover {
  background: #218838;
}

.btn-danger {
  background: var(--tg-red);
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
