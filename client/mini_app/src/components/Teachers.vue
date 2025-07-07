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
          <p>telegram: {{ teacher.telegramUsername }}</p>
          <p v-if="teacher.email">Email: {{ teacher.email }}</p>
          <p>Группы: {{ teacher.groups && teacher.groups.length > 0 ? teacher.groups.join(', ') : 'Не назначены' }}</p>
        </div>
        <div class="actions-overlay">
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
import TeachersAPIClient from '../../api/TeachersAPIClient.js';
import { Teachers } from '../../models/Teachers.js';

export default {
  name: 'Teachers',
  setup() {
    const apiClient = new TeachersAPIClient(); // Создаем экземпляр API-клиента
    const teachers = ref([]); // Список учителей
    const isLoading = ref(false); // Индикатор загрузки
    const showModal = ref(false); // Управление модальным окном
    const isEditing = ref(false); // Режим редактирования
    const currentTeacherId = ref(null); // ID редактируемого учителя
    const usernameError = ref(''); // Ошибка валидации username
    const errorMessage = ref(''); // Общее сообщение об ошибке

    const newTeacher = ref(new Teachers()); // Инициализируем как новый экземпляр класса Teachers

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

        // Проверяем структуру ответа
        let teachersData = [];
        if (response && response.data && Array.isArray(response.data)) {
          teachersData = response.data; // Если { data: [...] }
        } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
          teachersData = response.data.data; // Если { data: { data: [...] } }
        } else if (Array.isArray(response)) {
          teachersData = response; // Если массив напрямую
        } else {
          teachersData = [];
          errorMessage.value = 'Получены некорректные данные от сервера.';
        }

        if (Array.isArray(teachersData)) {
          teachers.value = teachersData.map(teacherData => {
            return Teachers.fromApiObject(teacherData);
          });
        } else {
          teachers.value = [];
          errorMessage.value = 'Получены некорректные данные от сервера.';
        }
      } catch (error) {
        if (error.response) {
        }
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
      newTeacher.value = new Teachers(); // Сбрасываем на новый пустой экземпляр Teachers
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
          if (error.response) {
            console.error('Ответ сервера (ошибка проверки username):', error.response);
          }
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
      teacherData.typeUser = 1;

      try {
        if (isEditing.value) {
          const response = await apiClient.updateTeacher(currentTeacherId.value, teacherData);
        } else {
          const response = await apiClient.createTeacher(teacherData);
        }
        await fetchTeachers(); // Обновляем список после изменения
        closeModal();
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

    // Удаление учителя
    const deleteTeacher = async (teacher) => {
      if (confirm(`Вы уверены, что хотите удалить учителя "${teacher.fullName}"?`)) {
        isLoading.value = true;
        errorMessage.value = '';
        try {
          const response = await apiClient.deleteTeacher(teacher.id);
          await fetchTeachers(); // Обновляем список после удаления
        } catch (error) {
          if (error.response) {
          }
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Ширина карточки остается компактной */
  gap: 16px; /* Уменьшили отступы между карточками */
  width: 100%;
}

.teacher-card {
  background: var(--tg-card-bg);
  border-radius: var(--border-radius-card);
  box-shadow: var(--box-shadow-card);
  padding: 16px; /* Уменьшили внутренние отступы */
  border-left: 3px solid var(--tg-blue); /* Уменьшили толщину полоски */
  display: flex;
  flex-direction: column;
  gap: 8px; /* Уменьшили отступы между элементами внутри карточки для компактности */
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-height: 120px; /* Уменьшили минимальную высоту карточки */
  overflow: hidden;
}

.teacher-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--box-shadow-hover);
}

.teacher-info {
  flex: 1;
  z-index: 1; /* Текст остается поверх затемнения */
}

.teacher-info h4 {
  font-size: 1em; /* Уменьшили размер шрифта для ФИО */
  font-weight: 600;
  color: var(--tg-text);
  margin: 0 0 6px 0; /* Уменьшили отступы */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* Запрещаем перенос на новую строку */
}

.teacher-info p {
  margin: 0 0 4px 0; /* Уменьшили отступы для компактности */
  font-size: 0.8em; /* Уменьшили размер шрифта */
  color: var(--tg-text-light);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* Запрещаем перенос на новую строку */
}

.teacher-info p:last-child {
  margin-bottom: 0;
}

.actions-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Затемнение фона карточки */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px; /* Уменьшили отступы между кнопками */
  opacity: 0; /* Скрываем по умолчанию */
  transition: opacity 0.2s ease;
  padding: 10px;
  z-index: 2; /* Кнопки поверх контента */
  border-radius: var(--border-radius-card);
}

.teacher-card:hover .actions-overlay {
  opacity: 1; /* Показываем затемнение и кнопки при наведении */
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px; /* Уменьшили отступ между иконкой и текстом */
  padding: 8px 12px; /* Уменьшили размеры кнопок */
  border: none;
  border-radius: var(--border-radius-button);
  cursor: pointer;
  font-size: 0.85em; /* Уменьшили размер шрифта */
  font-weight: 600;
  transition: background-color var(--transition-speed);
  width: 90%; /* Кнопки занимают почти всю ширину карточки */
  justify-content: center;
  white-space: nowrap;
  z-index: 3; /* Убедимся, что кнопки кликабельны */
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
    padding: 16px;
  }

  .actions-overlay {
    flex-direction: column;
    opacity: 0;
  }

  .teacher-card:hover .actions-overlay {
    opacity: 0;

  }
}
</style>
