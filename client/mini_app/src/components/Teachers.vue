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
        <div class="teacher-info">
          <h4>{{ teacher.name }}</h4>
          <p>Username: @{{ teacher.telegramUsername }}</p>
          <p v-if="teacher.email">Email: {{ teacher.email }}</p>
          <p>Группы: {{ teacher.groups.length > 0 ? teacher.groups.join(', ') : 'Не назначены' }}</p>
        </div>
        <div class="actions">
          <button class="btn btn-secondary" @click="editTeacher(teacher)">
            <i data-feather="edit-2"></i>
            Редактировать
          </button>
          <button class="btn btn-danger" @click="deleteTeacher(teacher)">
            <i data-feather="trash-2"></i>
            Удалить
          </button>
        </div>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div class="empty-state" v-if="data.teachers.length === 0">
      <div class="empty-icon">
        <i data-feather="user-check"></i>
      </div>
      <h3>Пока нет учителей</h3>
      <p>Добавьте первого учителя для начала работы</p>
      <button class="btn btn-primary" @click="addNewTeacher">
        <i data-feather="plus"></i>
        Добавить первого учителя
      </button>
    </div>

    <!-- Модальное окно для добавления учителя -->
    <div v-if="showModal" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Добавить нового учителя</h3>
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
            <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
              Добавить учителя
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUpdated, nextTick } from 'vue'

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
    const showModal = ref(false)
    const usernameError = ref('')

    const newTeacher = ref({
      lastName: '',
      firstName: '',
      middleName: '',
      telegramUsername: '',
      email: ''
    })

    const isFormValid = computed(() => {
      return newTeacher.value.lastName.trim() &&
             newTeacher.value.firstName.trim() &&
             newTeacher.value.telegramUsername.trim() &&
             !usernameError.value
    })

    const addNewTeacher = () => {
      showModal.value = true
      resetForm()
    }

    const closeModal = () => {
      showModal.value = false
      resetForm()
    }

    const resetForm = () => {
      newTeacher.value = {
        lastName: '',
        firstName: '',
        middleName: '',
        telegramUsername: '',
        email: ''
      }
      usernameError.value = ''
    }

    const validateUsername = () => {
      const username = newTeacher.value.telegramUsername

      // Убираем @ если пользователь ввел его
      if (username.startsWith('@')) {
        newTeacher.value.telegramUsername = username.slice(1)
      }

      // Проверяем валидность username
      const usernameRegex = /^[a-zA-Z0-9_]{5,32}$/
      if (username && !usernameRegex.test(newTeacher.value.telegramUsername)) {
        usernameError.value = 'Username должен содержать 5-32 символа (буквы, цифры, _)'
      } else {
        usernameError.value = ''
      }
    }

    const submitTeacher = () => {
      if (!isFormValid.value) return

      const fullName = [
        newTeacher.value.lastName,
        newTeacher.value.firstName,
        newTeacher.value.middleName
      ].filter(Boolean).join(' ')

      const teacher = {
        id: Date.now(),
        name: fullName,
        email: newTeacher.value.email || '',
        telegramUsername: newTeacher.value.telegramUsername,
        groups: []
      }

      const updatedTeachers = [...props.data.teachers, teacher]
      emit('update-data', { teachers: updatedTeachers })

      closeModal()
      console.log('Добавлен новый учитель:', teacher)
    }

    const editTeacher = (teacher) => {
      console.log('Editing teacher:', teacher)
    }

    const deleteTeacher = (teacher) => {
      if (confirm(`Вы уверены, что хотите удалить учителя "${teacher.name}"?`)) {
        const updatedTeachers = props.data.teachers.filter(t => t.id !== teacher.id)
        emit('update-data', { teachers: updatedTeachers })
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
      showModal,
      newTeacher,
      usernameError,
      isFormValid,
      addNewTeacher,
      closeModal,
      submitTeacher,
      validateUsername,
      editTeacher,
      deleteTeacher
    }
  }
}
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
    max-height: none;
  }

  .teacher-form {
    padding: 16px;
  }
}
</style>
