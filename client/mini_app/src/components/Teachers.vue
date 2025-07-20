<template>
  <div class="teachers">
    <div class="section-header">
      <h2>Управление учителями</h2>
      <button class="btn btn-primary" @click="addNewTeacher" :disabled="isLoading">
        <i data-feather="plus"></i>
        Добавить учителя
      </button>
    </div>

    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Поиск по имени учителя...">
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Загрузка данных...</p>
    </div>

    <div v-else-if="filteredTeachers.length > 0" class="teachers-list">
      <div
        v-for="teacher in filteredTeachers"
        :key="teacher.id"
        class="teacher-item"
        :class="{ 'actions-visible': activeCardId === teacher.id }"
      >
        <div class="teacher-details">
          <h4> <i data-feather="user"></i>  {{ teacher.fullName }}</h4>
          <p>
            Telegram: <a v-if="teacher.telegramUsername">{{ teacher.telegramUsername }}</a><a v-else>—</a><br>
            Группы: {{ teacher.groups && teacher.groups.length > 0 ? teacher.groups.join(', ') : 'Не назначены' }}
          </p>
        </div>

        <div class="actions-overlay" @click.stop="toggleActions(null)">
          <button class="btn btn-secondary" @click.stop="editTeacher(teacher)" :disabled="isLoading">
            <i data-feather="edit-2"></i>
            Редактировать
          </button>
          <button class="btn btn-danger" @click.stop="deleteTeacher(teacher)" :disabled="isLoading">
            <i data-feather="trash-2"></i>
            Удалить
          </button>
        </div>

        <button class="teacher-actions-toggle" @click.stop="toggleActions(teacher.id)">
          <i data-feather="more-vertical"></i>
        </button>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">
        <i data-feather="user-check"></i>
      </div>
      <h3>Пока нет учителей</h3>
      <p>Добавьте первого учителя для начала работы</p>
      <button class="btn btn-primary" @click="addNewTeacher" :disabled="isLoading">
        <i data-feather="plus"></i>
        Добавить первого учителя
      </button>
    </div>

    <div v-if="showModal" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditing ? 'Редактировать учителя' : 'Добавить нового учителя' }}</h3>
          <button class="close-btn" @click="closeModal">
            <i data-feather="x"></i>
          </button>
        </div>
        <form @submit.prevent="submitTeacher" class="teacher-form">
          <div class="form-group">
            <label for="lastName">Фамилия *</label>
            <input id="lastName" v-model="newTeacher.lastName" type="text" class="form-input" placeholder="Введите фамилию" required />
          </div>
          <div class="form-group">
            <label for="firstName">Имя *</label>
            <input id="firstName" v-model="newTeacher.firstName" type="text" class="form-input" placeholder="Введите имя" required />
          </div>
          <div class="form-group">
            <label for="middleName">Отчество</label>
            <input id="middleName" v-model="newTeacher.middleName" type="text" class="form-input" placeholder="Введите отчество (необязательно)" />
          </div>
          <div class="form-group">
            <label for="telegramUsername">Username Telegram *</label>
            <div class="input-with-prefix">
              <span class="input-prefix">@</span>
              <input id="telegramUsername" v-model="newTeacher.telegramUsername" type="text" class="form-input with-prefix" placeholder="username" required @input="validateUsername" />
            </div>
            <div v-if="usernameError" class="error-message">{{ usernameError }}</div>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" v-model="newTeacher.email" type="email" class="form-input" placeholder="teacher@example.com (необязательно)" />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal">Отмена</button>
            <button type="submit" class="btn btn-primary" :disabled="!isFormValid || isLoading">
              {{ isEditing ? 'Сохранить изменения' : 'Добавить учителя' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUpdated, nextTick } from 'vue';
import TeachersAPIClient from '../../api/TeachersAPIClient.js';
import { Teachers } from '../../models/Teachers.js';
import GroupsAPIClient from "../../api/GroupsAPIClient.js";

export default {
  name: 'Teachers',
  setup() {
    const apiClient = new TeachersAPIClient();
    const groupAPIClient = new GroupsAPIClient();
    const teachers = ref([]);
    const isLoading = ref(false);
    const showModal = ref(false);
    const isEditing = ref(false);
    const currentTeacherId = ref(null);
    const usernameError = ref('');
    const errorMessage = ref('');
    const searchQuery = ref('');
    const activeCardId = ref(null);

    const newTeacher = ref(new Teachers());

    const isFormValid = computed(() => {
      return (
        newTeacher.value.lastName.trim() &&
        newTeacher.value.firstName.trim() &&
        newTeacher.value.telegramUsername.trim() &&
        !usernameError.value
      );
    });

    const filteredTeachers = computed(() => {
      if (!searchQuery.value) return teachers.value;
      return teachers.value.filter(teacher =>
        teacher.fullName.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });


    const fetchAllTeachersGroups = async (teachersData) => {
  try {
    const usernames = teachersData
      .map(teacher => teacher.tgUsername)
      .filter(username => username);

    if (usernames.length === 0) {
      return {};
    }



    const groupsResponse = await groupAPIClient.getGroupsByTeacher(usernames);

    const teacherGroupsMap = {};

    if (groupsResponse?.message?.groups && Array.isArray(groupsResponse.message.groups)) {
      groupsResponse.message.groups.forEach(group => {
        const teacherUsername = group.User?.tgUsername;
        if (teacherUsername) {
          if (!teacherGroupsMap[teacherUsername]) {
            teacherGroupsMap[teacherUsername] = [];
          }
          teacherGroupsMap[teacherUsername].push(group.name);
        }
      });
    }

    return teacherGroupsMap;

  } catch (error) {
    console.error('Ошибка при загрузке групп для учителей:', error);
    return {};
  }
};

    const fetchTeachers = async () => {
      isLoading.value = true;
      errorMessage.value = '';
      try {
        const teachersResponse = await apiClient.getAllTeachers(1);
        let teachersData = [];
        teachersData = teachersResponse.data.message;
        
        // Получаем группы для всех учителей одним запросом
        const teacherGroupsMap = await fetchAllTeachersGroups(teachersData);

        teachers.value = teachersData.map(teacherData => {
          const username = teacherData.tgUsername;
          const groupNames = teacherGroupsMap[username] || [];
          return Teachers.fromApiObject(teacherData, groupNames);
        });

        console.log('Итоговый список учителей:', teachers.value);

      } catch (error) {
        console.error('Ошибка при загрузке учителей:', error);
        errorMessage.value = `Не удалось загрузить список учителей. ${error.message}`;
        teachers.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    const addNewTeacher = () => {
      showModal.value = true;
      isEditing.value = false;
      currentTeacherId.value = null;
      resetForm();
    };

    const editTeacher = (teacher) => {
      isEditing.value = true;
      currentTeacherId.value = teacher.id;
      newTeacher.value = new Teachers({
        id: teacher.id,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        middleName: teacher.middleName,
        telegramUsername: teacher.telegramUsername,
        email: teacher.email
      });
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      resetForm();
    };

    const resetForm = () => {
      newTeacher.value = new Teachers();
      usernameError.value = '';
    };

    const validateUsername = () => {
      const username = newTeacher.value.telegramUsername;
      if (username.startsWith('@')) {
        newTeacher.value.telegramUsername = username.slice(1);
      }

      const usernameRegex = /^[a-zA-Z0-9_]{5,32}$/;
      if (username && !usernameRegex.test(newTeacher.value.telegramUsername)) {
        usernameError.value = 'Username должен содержать 5-32 символа (буквы, цифры, _)';
        return;
      }

      const isUsernameTaken = teachers.value.some(t =>
          (isEditing.value ? t.id !== currentTeacherId.value : true) &&
          t.telegramUsername.toLowerCase() === newTeacher.value.telegramUsername.toLowerCase()
      );

      if (isUsernameTaken) {
        usernameError.value = 'Этот username уже используется другим учителем';
      } else {
        usernameError.value = '';
      }
    };

    const submitTeacher = async () => {
      validateUsername();
      if (!isFormValid.value) return;

      isLoading.value = true;
      errorMessage.value = '';

      const teacherData = newTeacher.value.toApiObject();
      teacherData.typeUser = 1;

      try {
        if (isEditing.value) {
          await apiClient.updateTeacher(currentTeacherId.value, teacherData);
        } else {
          await apiClient.createTeacher(teacherData);
        }
        closeModal();
        await fetchTeachers();
      } catch (error) {
        if (error.response) {
          errorMessage.value = `Ошибка: ${error.response.data?.message || 'Не удалось сохранить данные учителя.'}`;
        } else if (error.code === 'ERR_NETWORK') {
          errorMessage.value = 'Ошибка сети: сервер недоступен или блокирует запросы (CORS).';
        } else {
          errorMessage.value = 'Не удалось сохранить данные учителя. Попробуйте снова.';
        }
      } finally {
        isLoading.value = false;
      }
    };

    const deleteTeacher = async (teacher) => {
      if (confirm(`Вы уверены, что хотите удалить учителя "${teacher.fullName}"?`)) {
        isLoading.value = true;
        errorMessage.value = '';
        try {
          await apiClient.deleteTeacher(teacher.telegramUsername);
          await fetchTeachers();
        } catch (error) {
          errorMessage.value = 'Не удалось удалить учителя. Попробуйте снова.';
        } finally {
          isLoading.value = false;
        }
      }
    };

    const toggleActions = (teacherId) => {
      activeCardId.value = activeCardId.value === teacherId ? null : teacherId;
    };

    const updateFeather = () => {
      nextTick(() => {
        if (window.feather) {
          window.feather.replace();
        }
      });
    };

    onMounted(() => {
      fetchTeachers();
      updateFeather();
    });

    onUpdated(updateFeather);

    return {
      teachers,
      isLoading,
      showModal,
      isEditing,
      newTeacher,
      usernameError,
      isFormValid,
      errorMessage,
      searchQuery,
      filteredTeachers,
      activeCardId,
      addNewTeacher,
      closeModal,
      submitTeacher,
      validateUsername,
      editTeacher,
      deleteTeacher,
      toggleActions
    };
  }
};
</script>

<style scoped>
.teachers {
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
  margin-bottom: 24px;
}

.search-bar input {
  flex: 1;
  padding: 12px 16px;
  border-radius: var(--border-radius-button);
  border: 2px solid var(--tg-border);
  font-size: 1em;
}

.search-bar input:focus {
  border-color: var(--tg-blue);
  outline: none;
}

.teachers-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.teacher-item {
  display: flex;
  align-items: center;
  gap: 18px;
  background: var(--tg-card-bg);
  border-radius: var(--border-radius-card);
  box-shadow: var(--box-shadow-card);
  padding: 18px 24px;
  position: relative;
  min-height: 110px;
  transition: box-shadow 0.2s ease;
}

.teacher-details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.teacher-details h4 {
  font-size: 1.1em;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: var(--tg-text);
  display: flex;
  align-items: center;
  gap: 8px;
}

.teacher-details p {
  margin: 0;
  color: var(--tg-text-light);
  font-size: 0.9em;
  line-height: 1.5;
}

.actions-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  padding: 10px;
  z-index: 3;
  border-radius: var(--border-radius-card);
}

.teacher-actions-toggle {
  display: none;
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
  z-index: 2;
}

.teacher-actions-toggle:hover {
  background-color: rgba(0,0,0,0.1);
}

.teacher-actions-toggle i {
  color: var(--tg-text-light);
}

.teacher-item.actions-visible .actions-overlay {
  opacity: 1;
  pointer-events: auto;
}

@media (min-width: 769px) {
  .teacher-item:hover .actions-overlay {
    opacity: 1;
    pointer-events: auto;
  }
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
  }
  .teacher-actions-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .teacher-item:hover .actions-overlay {
    opacity: 0;
    pointer-events: none;
  }
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

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: var(--tg-text-light);
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--tg-border);
  border-top: 3px solid var(--tg-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

.teacher-form {
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

.input-with-prefix {
  position: relative;
  display: flex;
  align-items: center;
}

.input-prefix {
  position: absolute;
  left: 16px;
  color: var(--tg-text-light);
  font-weight: 600;
  z-index: 1;
  pointer-events: none;
}

.form-input.with-prefix {
  padding-left: 32px;
}

.error-message {
  color: var(--tg-red);
  font-size: 0.8em;
  margin-top: 4px;
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
