<template>
  <div class="groups">
    <div class="section-header">
      <div class="header-content">
        <h2>Управление группами</h2>
      </div>
      <button class="btn btn-primary" @click="addNewGroup" :disabled="isLoading">
        <i data-feather="plus"></i>
        Добавить группу
      </button>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Загрузка данных...</p>
    </div>

    <div class="groups-grid" v-else-if="groups.length > 0">
      <div
        v-for="group in groups"
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
            <span class="stat-label">Преподаватель:</span>
            <span class="stat-value">{{ group.teacherName || 'Не назначен' }}</span>
          </div>
        </div>

        <div class="group-actions">
          <button class="btn btn-secondary" @click="editGroup(group)" :disabled="isLoading">
            <i data-feather="edit-2"></i>
            Редактировать
          </button>
          <button class="btn btn-primary" @click="addStudentsToGroup(group)" :disabled="isLoading">
            <i data-feather="user-plus"></i>
            Участники
          </button>

        <button v-if="!group.teacherId" class="btn btn-primary" @click="assignTeacherToGroup(group)" :disabled="isLoading">
            <i data-feather="user-check"></i>
          Назначить преподавателя
        </button>

        <button v-else class="btn btn-danger" @click="unassignTeacher(group)" :disabled="isLoading">
         <i data-feather="user-x"></i>
          Отвязать преподавателя
        </button>

          <button class="btn btn-danger" @click="deleteGroup(group)" :disabled="isLoading">
            <i data-feather="trash-2"></i>
            Удалить
          </button>
          <button class="btn btn-info" @click="sendGroupBalance(group)" :disabled="isLoading">
    <i data-feather="send"></i>
    Отправить баланс в чат
  </button>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <div class="empty-icon">
        <i data-feather="users"></i>
      </div>
      <h3>Пока нет групп</h3>
      <p>Создайте первую группу для начала работы</p>
      <button class="btn btn-primary" @click="addNewGroup" :disabled="isLoading">
        <i data-feather="plus"></i>
        Создать первую группу
      </button>
    </div>

    <!-- Модальное окно для создания/редактирования группы -->
    <div v-if="showGroupModal" class="modal" @click.self="closeGroupModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditingGroup ? 'Редактировать группу' : 'Добавить новую группу' }}</h3>
          <button class="close-btn" @click="closeGroupModal">
            <i data-feather="x"></i>
          </button>
        </div>
        <form @submit.prevent="submitGroup" class="group-form">
          <div class="form-group">
            <label for="groupName">Название группы *</label>
            <input
              id="groupName"
              v-model="newGroup.name"
              type="text"
              class="form-input"
              placeholder="Введите название группы"
              required
            />
          </div>
          <div class="form-group">
            <label for="groupDescription">Описание</label>
            <textarea
              id="groupDescription"
              v-model="newGroup.description"
              class="form-input"
              placeholder="Введите описание группы (необязательно)"
              rows="3"
            ></textarea>
          </div>
          <div class="form-group">
    <label for="groupLink">Ссылка на чат</label>
    <input
      id="groupLink"
      v-model="newGroup.urlName"
      type="text"
      class="form-input"
      placeholder="t.me/username_группы"
    />
    <p class="form-text">
    Введите публичную ссылку на чат, если она есть.<br>
    Без нее невозможно будет отправить баланс группы в чат!
  </p>
  </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeGroupModal">
              Отмена
            </button>
            <button type="submit" class="btn btn-primary" :disabled="!isGroupFormValid || isLoading">
              {{ isEditingGroup ? 'Сохранить изменения' : 'Добавить группу' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Модальное окно для добавления участников в группу -->
    <div v-if="showStudentsModal" class="modal" @click.self="closeStudentsModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Добавить участников в группу "{{ currentGroup.name }}"</h3>
          <button class="close-btn" @click="closeStudentsModal">
            <i data-feather="x"></i>
          </button>
        </div>
        <div class="search-bar">
          <input
            type="text"
            v-model="studentSearchQuery"
            placeholder="Поиск по имени ребенка..."
          />
        </div>
        <div class="students-list" v-if="filteredStudents.length > 0">
          <div
            v-for="student in filteredStudents"
            :key="student.id"
            class="student-item"
          >
            <input
              type="checkbox"
              :value="student.id"
              v-model="selectedStudents"
            />
            <div class="student-details">
              <h4>{{ student.lastName }} {{ student.name }} {{ student.secondName }}</h4>
            </div>
            <div class="student-actions">
      <button
        class="btn btn-icon"
        @click.stop="sendChildBalance(student)"
        title="Отправить баланс в чат"
        :disabled="isLoading">
        <i data-feather="send"></i>
      </button>
    </div>
          </div>
        </div>
        <div class="empty-state-small" v-else>
          <p>Нет доступных учеников для добавления</p>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="closeStudentsModal">
            Отмена
          </button>
          <button class="btn btn-primary" @click="saveStudentsToGroup" :disabled="selectedStudents.length === 0 || isLoading">
            Добавить выбранных ({{ selectedStudents.length }})
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно для привязки учителя к группе -->
    <div v-if="showTeacherModal" class="modal" @click.self="closeTeacherModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Привязать учителя к группе "{{ currentGroup.name }}"</h3>
          <button class="close-btn" @click="closeTeacherModal">
            <i data-feather="x"></i>
          </button>
        </div>
        <div class="search-bar">
          <input
            type="text"
            v-model="teacherSearchQuery"
            placeholder="Поиск по имени учителя..."
          />
        </div>
        <div class="teachers-list" v-if="filteredTeachers.length > 0">
          <div
            v-for="teacher in filteredTeachers"
            :key="teacher.id"
            class="teacher-item"
            @click="selectTeacher(teacher)"
            :class="{ selected: selectedTeacherId === teacher.id }"
          >
            <h4>{{ teacher.lastName }} {{ teacher.name }} {{ teacher.secondName }}</h4>
          </div>
        </div>
        <div class="empty-state-small" v-else>
          <p>Нет доступных учителей для привязки</p>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="closeTeacherModal">
            Отмена
          </button>
          <button class="btn btn-primary" @click="saveTeacherToGroup" :disabled="!selectedTeacherId || isLoading">
            Привязать учителя
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, computed, onMounted, onUpdated, nextTick } from 'vue';
import GroupsAPIClient from '../../api/GroupsAPIClient.js';
import ChildrenAPIClient from '../../api/ChildrenAPIClient.js';
import TeachersAPIClient from '../../api/TeachersAPIClient.js';
import InfoBotAPIClient from '../../api/InfoBotAPIClient.js';

export default {
  name: 'Groups',
  setup() {
    const groupsApiClient = new GroupsAPIClient();
    const childrenApiClient = new ChildrenAPIClient();
    const teachersApiClient = new TeachersAPIClient();

    const groups = ref([]);
    const isLoading = ref(false);
    const errorMessage = ref('');

    const showGroupModal = ref(false);
    const isEditingGroup = ref(false);
    const currentGroupId = ref(null);
    const newGroup = ref({ name: '', description: '', urlName: '' });
    const showStudentsModal = ref(false);
    const currentGroup = ref({});
    const students = ref([]);
    const studentSearchQuery = ref('');
    const selectedStudents = ref([]);
    const showTeacherModal = ref(false);
    const teachers = ref([]);
    const teacherSearchQuery = ref('');
    const selectedTeacherId = ref(null);

    const isGroupFormValid = computed(() => newGroup.value.name.trim());

      const showAppAlert = (message) => {
      if (window.Telegram && window.Telegram.WebApp) {
        try {
          window.Telegram.WebApp.showAlert(message);
        } catch (e) {
          console.warn('Telegram.WebApp.showAlert is not supported, falling back to alert().', e);
          alert(message);
        }
      } else {
        console.log('Telegram WebApp not available, using alert().');
        alert(message);
      }
    };
    const filteredStudents = computed(() => {
      const filtered = students.value.filter(student =>
        `${student.name} ${student.lastName || ''} ${student.secondName || ''}`
          .toLowerCase()
          .includes(studentSearchQuery.value.toLowerCase())
      );

      return [...filtered].sort((a, b) => {
        const aIsSelected = selectedStudents.value.includes(a.id);
        const bIsSelected = selectedStudents.value.includes(b.id);
        if (aIsSelected && !bIsSelected) return -1;
        if (!aIsSelected && bIsSelected) return 1;
        return 0;
      });
    });

    const filteredTeachers = computed(() => {
      if (!teacherSearchQuery.value) return teachers.value;
      return teachers.value.filter(teacher =>
        `${teacher.lastName} ${teacher.name} ${teacher.secondName}`
          .toLowerCase()
          .includes(teacherSearchQuery.value.toLowerCase())
      );
    });


    const sendGroupBalance = async (group) => {
  if (!group.urlName || group.urlName.trim() === '') {
    showAppAlert('У этой группы не указана публичная ссылка. Добавьте ее в настройках группы.');
    return;
  }

  const isConfirmed = confirm(`Вы уверены, что хотите отправить отчет по балансу группы "${group.name}" в связанный чат?`);
  if (!isConfirmed) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {

    const reportText = `Отчет по балансу для группы: ${group.name}`;

    await InfoBotAPIClient.sendNotification({
      chat_identifier: group.urlName,
      uuid_group:group.id,
      text: reportText
    });


  } catch (error) {
    console.error('Ошибка при отправке отчета о балансе:', error);
    const detail = error.response?.data?.detail || error.message || 'Произошла неизвестная ошибка.';
    errorMessage.value = `Не удалось отправить отчет: ${detail}`;
    showAppAlert(errorMessage.value);

  } finally {
    isLoading.value = false;
  }
};

    const fetchGroups = async () => {
      isLoading.value = true;
      errorMessage.value = '';
      try {
        const response = await groupsApiClient.getAllGroups();
        const groupsData = response?.message?.groups || [];
        if (Array.isArray(groupsData)) {
            groups.value = groupsData.map(groupData => {
                const personalData = groupData.User?.PersonalDatum;
                let teacherNameFormatted = 'Не назначен';
                if (personalData?.lastName && personalData?.name && personalData?.secondName) {
                    teacherNameFormatted = `${personalData.lastName} ${personalData.name[0]}.${personalData.secondName[0]}.`;
                }

                const participantIds = (groupData.EducationGroupMembers || [])
                    .map(member => member.User?.uuid)
                    .filter(Boolean);

                return {
                    id: groupData.uuid || Date.now().toString(),
                    name: groupData.name || 'Без названия',
                    description: groupData.description || '',
                    studentsCount: (groupData.EducationGroupMembers || []).length,
                    teacherName: teacherNameFormatted,
                    studentIds: participantIds,
                    teacherId: groupData.uuidUser || null,
                    urlName: groupData.urlName || ''
                };
            });
        } else {
            groups.value = [];
            errorMessage.value = 'Получены некорректные данные от сервера.';
        }
      } catch (error) {
          console.error('Ошибка при загрузке групп:', error);
          errorMessage.value = 'Не удалось загрузить список групп. Попробуйте позже.';
          groups.value = [];
      } finally {
          isLoading.value = false;
      }
    };


    const fetchStudents = async () => {
      try {
        const response = await childrenApiClient.getAllChildren(3);
        const studentsData = response.data.message;

        if (Array.isArray(studentsData)) {
          students.value = studentsData.map(studentData => ({
            id: studentData.uuid || Date.now().toString(),
            name: studentData.PersonalDatum?.name || '',
            lastName: studentData.PersonalDatum?.lastName || '',
            secondName: studentData.PersonalDatum?.secondName || '',
            tgUsername: studentData.tgUsername || null
          }));
        } else {
          students.value = [];
        }
      } catch (error) {
        console.error('Ошибка при загрузке учеников:', error);
        students.value = [];
      }
    };

    const fetchTeachers = async () => {
      try {
        const response = await teachersApiClient.getAllTeachers(1);
        const teachersData = response.data.message;

        if (Array.isArray(teachersData)) {
          teachers.value = teachersData.map(teacherData => ({
            id: teacherData.uuid || Date.now().toString(),
            name: teacherData.PersonalDatum?.name || '',
            lastName: teacherData.PersonalDatum?.lastName || '',
            secondName: teacherData.PersonalDatum?.secondName || '',
            tgUsername: teacherData.tgUsername || '@unknown'
          }));
        } else {
          teachers.value = [];
        }
      } catch (error) {
        console.error('Ошибка при загрузке учителей:', error);
        teachers.value = [];
      }
    };

    const addNewGroup = () => {
      showGroupModal.value = true;
      isEditingGroup.value = false;
      currentGroupId.value = null;
      newGroup.value = { name: '', description: '', urlName: '' };
    };

    const editGroup = (group) => {
      showGroupModal.value = true;
      isEditingGroup.value = true;
      currentGroupId.value = group.id;
      newGroup.value = { name: group.name, description: group.description, urlName: group.urlName };
    };

    const closeGroupModal = () => {
      showGroupModal.value = false;
    };

    const submitGroup = async () => {
      if (!isGroupFormValid.value) return;
      isLoading.value = true;
      errorMessage.value = '';
      try {
        const groupData = {
          name: newGroup.value.name,
          description: newGroup.value.description || '',
          urlName: newGroup.value.urlName || ''
        };
        if (isEditingGroup.value && currentGroupId.value) {
          groupData.uuid = currentGroupId.value;
          await groupsApiClient.updateGroup(groupData);
        } else {
          await groupsApiClient.createGroup(groupData);
        }
        closeGroupModal();
        await fetchGroups();
      } catch (error) {
        console.error('Ошибка при сохранении группы:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const deleteGroup = async (group) => {
      if (confirm(`Вы уверены, что хотите удалить группу "${group.name}"?`)) {
        isLoading.value = true;
        errorMessage.value = '';
        try {
          await groupsApiClient.deleteGroup(group.id);
          await fetchGroups();
        } catch (error) {
          console.error('Ошибка при удалении группы:', error);
          errorMessage.value = 'Не удалось удалить группу. Попробуйте снова.';
        } finally {
          isLoading.value = false;
        }
      }
    };

    const addStudentsToGroup = async (group) => {
      currentGroup.value = group;
      selectedStudents.value = [...(group.studentIds || [])];
      await fetchStudents();
      showStudentsModal.value = true;
    };

    const closeStudentsModal = () => {
      showStudentsModal.value = false;
      selectedStudents.value = [];
    };

    const saveStudentsToGroup = async () => {
      isLoading.value = true;
      errorMessage.value = '';
      try {
        const selectedUsernames = selectedStudents.value.map(studentId => {
          const student = students.value.find(s => s.id === studentId);
          return student ? student.tgUsername : null;
        }).filter(username => username !== null);

        const addData = {
          uuidGroup: currentGroup.value.id,
          childrens: selectedUsernames
        };

        if (addData.childrens.length === 0) {
            errorMessage.value = 'Не выбраны ученики с действительным Telegram username.';
            isLoading.value = false;
            return;
        }
        await groupsApiClient.addChildrens(addData);
        closeStudentsModal();
        await fetchGroups();
      } catch (error) {
        errorMessage.value = 'Не удалось добавить учеников в группу. Попробуйте снова.';
      } finally {
        isLoading.value = false;
      }
    };

    const assignTeacherToGroup = async (group) => {
      currentGroup.value = group;
      selectedTeacherId.value = group.teacherId || null;
      await fetchTeachers();
      showTeacherModal.value = true;
    };

    const closeTeacherModal = () => {
      showTeacherModal.value = false;
      selectedTeacherId.value = null;
    };

    const selectTeacher = (teacher) => {
      selectedTeacherId.value = teacher.id;
    };

    const saveTeacherToGroup = async () => {
      isLoading.value = true;
      errorMessage.value = '';
      try {
        const snapData = {
          tgUsername: teachers.value.find(t => t.id === selectedTeacherId.value)?.tgUsername || '@unknown',
          uuid: currentGroup.value.id
        };
        await groupsApiClient.SnapTeacher(snapData);
        closeTeacherModal();
        await fetchGroups();
      } catch (error) {
        console.error('Ошибка при привязке учителя к группе:', error);
        errorMessage.value = 'Не удалось привязать учителя к группе. Попробуйте снова.';
      } finally {
        isLoading.value = false;
      }
    };

    const unassignTeacher = async (group) => {
      if (confirm(`Вы уверены, что хотите отвязать учителя от группы "${group.name}"?`)) {
        isLoading.value = true;
        errorMessage.value = '';
        try {
          await groupsApiClient.UntieTeacher(group.id);
          await fetchGroups();
        } catch (error) {
          errorMessage.value = 'Не удалось отвязать учителя. Попробуйте снова.';
        } finally {
          isLoading.value = false;
        }
      }
    };

    const updateFeather = () => {
      nextTick(() => {
        if (window.feather) {
          window.feather.replace();
        }
      });
    };

    onMounted(() => {
      fetchGroups();
      updateFeather();
    });

    onUpdated(updateFeather);

    return {
      groups,
      isLoading,
      errorMessage,
      showGroupModal,
      isEditingGroup,
      newGroup,
      isGroupFormValid,
      showStudentsModal,
      currentGroup,
      students,
      studentSearchQuery,
      filteredStudents,
      selectedStudents,
      showTeacherModal,
      teachers,
      teacherSearchQuery,
      filteredTeachers,
      selectedTeacherId,
      addNewGroup,
      editGroup,
      deleteGroup,
      closeGroupModal,
      submitGroup,
      addStudentsToGroup,
      closeStudentsModal,
      saveStudentsToGroup,
      assignTeacherToGroup,
      closeTeacherModal,
      selectTeacher,
      saveTeacherToGroup,
      unassignTeacher,
      sendGroupBalance
    };
  }
};
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
  display: flex;
  flex-direction: column;
}

.group-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.group-header, .group-stats {
  margin-bottom: 20px;
}
.group-stats {
  flex-grow: 1;
}


.group-header {
  display: flex;
  align-items: center;
  gap: 16px;
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
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
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
  transition: all var(--transition-speed);
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

.group-actions .btn {
  width: 100%;
  border-width: 1.5px;
  border-style: solid;
}

.group-actions .btn-primary {
  background: transparent;
  border-color: var(--tg-blue);
  color: var(--tg-blue);
}
.group-actions .btn-primary:hover {
  background: var(--tg-blue);
  color: white;
  transform: translateY(-1px);
}

.group-actions .btn-secondary {
  background: transparent;
  border-color: var(--tg-secondary);
  color: var(--tg-secondary);
}
.group-actions .btn-secondary:hover {
  background: var(--tg-secondary);
  color: white;
  transform: translateY(-1px);
}

.group-actions .btn-danger {
  background: transparent;
  border-color: var(--tg-red);
  color: var(--tg-red);
}
.group-actions .btn-danger:hover {
  background: var(--tg-red);
  color: white;
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--tg-secondary) !important;
  color: white !important;
  border-color: var(--tg-secondary) !important;
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

.empty-state-small {
  text-align: center;
  padding: 20px;
  color: var(--tg-text-light);
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
  max-width: 600px;
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

.group-form {
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

textarea.form-input {
  resize: vertical;
  min-height: 100px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--tg-border);
}

.search-bar {
  display: flex;
  gap: 12px;
  margin: 16px 24px;
}

.search-bar input {
  flex: 1;
  padding: 10px 16px;
  border-radius: var(--border-radius-button);
  border: 2px solid var(--tg-border);
  font-size: 1em;
  transition: border-color var(--transition-speed);
  background: var(--tg-card-bg);
  color: var(--tg-text);
}

.search-bar input:focus {
  border-color: var(--tg-blue);
  outline: none;
}

.search-bar input::placeholder {
  color: var(--tg-text-light);
}

.students-list, .teachers-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
  padding: 0 24px 24px 24px;
  margin-bottom: 10px;
}

.student-item, .teacher-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--tg-card-bg);
  border-radius: var(--border-radius-card);
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color var(--transition-speed), box-shadow var(--transition-speed);
  border: 1px solid var(--tg-border);
}

.student-item:hover, .teacher-item:hover {
  background: var(--tg-blue-light);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.teacher-item.selected {
  background: var(--tg-blue-light);
  border-left: 3px solid var(--tg-blue);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.student-item input[type="checkbox"] {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.student-details, .teacher-details {
  flex: 1;
}

.student-details h4, .teacher-item h4 {
  font-size: 1em;
  font-weight: 500;
  margin: 0;
  color: var(--tg-text);
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

  .modal-content {
    width: 95%;
    max-width: 350px;
  }

  .search-bar {
    margin: 12px 16px;
  }

  .students-list, .teachers-list {
    padding: 0 16px 16px 16px;
  }

}
  .btn-info {
  background: var(--tg-blue);
  border-color: #17a2b8;
  color: white;
}
.btn-info:hover {
  transform: translateY(-1px);
}

.student-item {

  display: flex;
  align-items: center;
  gap: 12px;

}

.student-details {

  flex-grow: 1;
}

.student-actions {

  margin-left: auto;
}

.btn-icon {
  background: transparent;
  border: 1px solid var(--tg-border);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--tg-text-light);
}

.btn-icon:hover {
  background: var(--tg-blue-light);
  color: var(--tg-blue);
  border-color: var(--tg-blue);
}

.btn-icon i {
  width: 18px;
  height: 18px;
}

.form-text {
  display: block;
  margin-top: 6px;
  font-size: 0.8em;
  line-height: 1.4;
  color: var(--tg-text-light);
}

</style>




