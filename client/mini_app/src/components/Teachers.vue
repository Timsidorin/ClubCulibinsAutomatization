<template>
  <div class="teachers">
    <div class="section-header">
      <h2>Управление учителями</h2>
      <button class="btn btn-primary" @click="addNewTeacher" :disabled="isLoading">
        <i data-feather="plus"></i>
        Добавить учителя
      </button>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Загрузка данных...</p>
    </div>

    <div v-else class="card-grid teacher-grid">
      <div
        v-for="teacher in teachers"
        :key="teacher.id"
        class="card teacher-card"
      >
        <div class="teacher-info">
          <h4>{{ teacher.fullName }}</h4>
          <p>Username: @{{ teacher.telegramUsername }}</p>
          <p v-if="teacher.email">Email: {{ teacher.email }}</p>
          <p>Группы: {{ teacher.groups && teacher.groups.length > 0 ? teacher.groups.join(', ') : 'Не назначены' }}</p>
        </div>
        <div class="actions">
          <button class="btn btn-secondary" @click="editTeacher(teacher)" :disabled="isLoading">
            <i data-feather="edit-2"></i>
            Редактировать
          </button>
          <button class="btn btn-danger" @click="deleteTeacher(teacher)" :disabled="isLoading">
            <i data-feather="trash-2"></i>
            Удалить
          </button>
        </div>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div class="empty-state" v-if="!isLoading && teachers.length === 0">
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

    <!-- Модальное окно для добавления/редактирования учителя -->
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
            <input
              id="lastName"
              v-model="newTeacher.lastName"
              type="text"
              class="form-input"
              placeholder="Введите фамилию"
              required
            />
          </div>

          <div class="form-group">
            <label for="firstName">Имя *</label>
            <input
              id="firstName"
              v-model="newTeacher.firstName"
              type="text"
              class="form-input"
              placeholder="Введите имя"
              required
            />
          </div>

          <div class="form-group">
            <label for="middleName">Отчество</label>
            <input
              id="middleName"
              v-model="newTeacher.middleName"
              type="text"
              class="form-input"
              placeholder="Введите отчество (необязательно)"
            />
          </div>

          <div class="form-group">
            <label for="telegramUsername">Username Telegram *</label>
            <div class="input-with-prefix">
              <span class="input-prefix">@</span>
              <input
                id="telegramUsername"
                v-model="newTeacher.telegramUsername"
                type="text"
                class="form-input with-prefix"
                placeholder="username"
                required
                @input="validateUsername"
              />
            </div>
            <div v-if="usernameError" class="error-message">
              {{ usernameError }}
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="newTeacher.email"
              type="email"
              class="form-input"
              placeholder="teacher@example.com (необязательно)"
            />
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Отмена
            </button>
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
import TeacherAPIClient from '../../api/TeacherAPIClient';
import { Teacher } from '../../models/Teacher';

export default {
  name: 'Teachers',
  setup() {
    const apiClient = new TeacherAPIClient(); // Создаем экземпляр API-клиента
    const teachers = ref([]); // Список учителей
    const isLoading = ref(false); // Индикатор загрузки
    const showModal = ref(false); // Управление модальным окном
    const isEditing = ref(false); // Режим редактирования
    const currentTeacherId = ref(null); // ID редактируемого учителя
    const usernameError = ref(''); // Ошибка валидации username
    const errorMessage = ref(''); // Общее сообщение об ошибке

    const newTeacher = ref(new Teacher()); // Инициализируем как новый экземпляр класса Teacher

    const isFormValid = computed(() => {
      return (
        newTeacher.value.lastName.trim() &&
        newTeacher.value.firstName.trim() &&
        newTeacher.value.telegramUsername.trim() &&
        !usernameError.value
      );
    });

    // Загрузка списка учителей
    const fetchTeachers = async () => {
      isLoading.value = true;
      errorMessage.value = '';
      try {
        const response = await apiClient.getAllTeachers();
        console.log("Ответ от API:", response);

        // Проверяем структуру ответа
        let teachersData = [];
        if (response && response.data && Array.isArray(response.data)) {
          teachersData = response.data; // Если { data: [...] }
        } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
          teachersData = response.data.data; // Если { data: { data: [...] } }
        } else if (Array.isArray(response)) {
          teachersData = response; // Если массив напрямую
        } else {
          console.error("Некорректная структура ответа API:", response);
          teachersData = [];
          errorMessage.value = 'Получены некорректные данные от сервера.';
        }

        if (Array.isArray(teachersData)) {
          teachers.value = teachersData.map(teacherData => Teacher.fromApiObject(teacherData));
        } else {
          teachers.value = [];
          errorMessage.value = 'Получены некорректные данные от сервера.';
        }
      } catch (error) {
        console.error('Ошибка при загрузке учителей:', error);
        errorMessage.value = 'Не удалось загрузить список учителей. Попробуйте позже.';
        teachers.value = []; // Сбрасываем список в случае ошибки
      } finally {
        isLoading.value = false;
      }
    };

    // Открытие формы для добавления нового учителя
    const addNewTeacher = () => {
      showModal.value = true;
      isEditing.value = false;
      currentTeacherId.value = null;
      resetForm();
    };

    // Открытие формы для редактирования учителя
    const editTeacher = (teacher) => {
      isEditing.value = true;
      currentTeacherId.value = teacher.id;
      // Копируем данные учителя в форму
      newTeacher.value = new Teacher({
        id: teacher.id,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        middleName: teacher.middleName,
        telegramUsername: teacher.telegramUsername,
        email: teacher.email
      });
      showModal.value = true;
    };

    // Закрытие модального окна
    const closeModal = () => {
      if (
        (newTeacher.value.lastName || newTeacher.value.firstName || newTeacher.value.telegramUsername) &&
        !confirm('Вы уверены, что хотите закрыть форму? Все данные будут потеряны.')
      ) {
        return;
      }
      showModal.value = false;
      resetForm();
    };

    // Сброс формы
    const resetForm = () => {
      newTeacher.value = new Teacher(); // Сбрасываем на новый пустой экземпляр Teacher
      usernameError.value = '';
    };

    // Валидация Telegram username
    const validateUsername = async () => {
      const username = newTeacher.value.telegramUsername;
      if (username.startsWith('@')) {
        newTeacher.value.telegramUsername = username.slice(1);
      }

      const usernameRegex = /^[a-zA-Z0-9_]{5,32}$/;
      if (username && !usernameRegex.test(newTeacher.value.telegramUsername)) {
        usernameError.value = 'Username должен содержать 5-32 символа (буквы, цифры, _)';
        return;
      }

      // Проверка уникальности username (только если не редактируем текущего учителя)
      if (!isEditing.value || teachers.value.some(t => t.id !== currentTeacherId.value && t.telegramUsername.toLowerCase() === newTeacher.value.telegramUsername.toLowerCase())) {
        try {
          const response = await apiClient.getTeacherByTelegramUsername(newTeacher.value.telegramUsername);
          if (response.data) {
            usernameError.value = 'Этот username уже используется другим учителем';
          } else {
            usernameError.value = '';
          }
        } catch (error) {
          usernameError.value = '';
          console.error('Ошибка при проверке username:', error);
        }
      } else {
        usernameError.value = '';
      }
    };

    // Отправка данных учителя (создание или обновление)
    const submitTeacher = async () => {
      if (!isFormValid.value) return;

      isLoading.value = true;
      errorMessage.value = '';
      // Преобразуем данные учителя в формат для API
      const teacherData = newTeacher.value.toApiObject();

      try {
        if (isEditing.value) {
          await apiClient.updateTeacher(currentTeacherId.value, teacherData);
          console.log('Учитель обновлен:', teacherData);
        } else {
          await apiClient.createTeacher(teacherData);
          console.log('Учитель добавлен:', teacherData);
        }
        await fetchTeachers(); // Обновляем список после изменения
        closeModal();
      } catch (error) {
        console.error('Ошибка при сохранении учителя:', error);
        errorMessage.value = 'Не удалось сохранить данные учителя. Попробуйте снова.';
      } finally {
        isLoading.value = false;
      }
    };

    // Удаление учителя
    const deleteTeacher = async (teacher) => {
      if (confirm(`Вы уверены, что хотите удалить учителя "${teacher.fullName}"?`)) {
        isLoading.value = true;
        errorMessage.value = '';
        try {
          await apiClient.deleteTeacher(teacher.id);
          await fetchTeachers(); // Обновляем список после удаления
          console.log('Учитель удален:', teacher);
        } catch (error) {
          console.error('Ошибка при удалении учителя:', error);
          errorMessage.value = 'Не удалось удалить учителя. Попробуйте снова.';
        } finally {
          isLoading.value = false;
        }
      }
    };

    // Обновление иконок Feather
    const updateFeather = () => {
      nextTick(() => {
        if (window.feather) {
          window.feather.replace();
        }
      });
    };

    // Загружаем данные при монтировании компонента
    onMounted(() => {
      console.log("=== Teachers onMounted ===");
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
      addNewTeacher,
      closeModal,
      submitTeacher,
      validateUsername,
      editTeacher,
      deleteTeacher
    };
  }
};
</script>

<style scoped>
/* Стили остаются без изменений */
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
  width: 100%;
}

.section-header h2 {
  font-size: 1.8em;
  font-weight: 700;
  color: var(--tg-blue);
  margin: 0;
}

.teacher-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
}

.teacher-card {
  background: var(--tg-card-bg);
  border-radius: var(--border-radius-card);
  box-shadow: var(--box-shadow-card);
  padding: 24px;
  border-left: 4px solid var(--tg-blue);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.teacher-info {
  flex: 1;
}

.teacher-info h4 {
  font-size: 1.2em;
  font-weight: 600;
  color: var(--tg-text);
  margin: 0 0 12px 0;
}

.teacher-info p {
  margin: 0 0 8px 0;
  font-size: 0.9em;
  color: var(--tg-text-light);
}

.teacher-info p:last-child {
  margin-bottom: 0;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
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
  transition: background-color var(--transition-speed);
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

/* Пустое состояние */
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

/* Модальное окно */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  overflow: hidden;
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

/* Форма */
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

/* Поле с префиксом @ */
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

/* Сообщение об ошибке */
.error-message {
  color: var(--tg-red);
  font-size: 0.8em;
  margin-top: 4px;
}

/* Действия модального окна */
.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--tg-border);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn:disabled:hover {
  background: var(--tg-blue);
}

/* Адаптивность */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding: 20px;
  }

  .teacher-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .teacher-card {
    padding: 20px;
  }

  .actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .modal-content {
    width: 95%;
    margin: 20px;
  }

  .modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .section-header {
    padding: 16px;
  }

  .teacher-card {
    padding: 16px;
  }

  .modal-content {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  .teacher-form {
    padding: 16px;
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: var(--tg-card-bg);
  border-radius: var(--border-radius-card);
  box-shadow: var(--box-shadow-card);
  width: 100%;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid var(--tg-border);
  border-top: 5px solid var(--tg-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: var(--tg-text-light);
  font-size: 1em;
}
</style>
