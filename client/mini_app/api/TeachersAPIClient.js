import ApiClient from './BaseAPIClient'

class TeachersAPIClient extends ApiClient {
    constructor() {
        super();
        this.endpoint = '/user';
    }


    async getAllTeachers() {
        return await this.get(`${this.endpoint}/get/all`);
    }

    // Получить учителя по ID
    async getTeacherById(id) {
        return await this.get(`${this.endpoint}/${id}`);
    }

    // Создать нового учителя
    async createTeacher(teacherData) {
        return await this.post(`${this.endpoint}/create`, teacherData);
    }

    // Обновить данные учителя
    async updateTeacher(id, teacherData) {
        return await this.put(`${this.endpoint}/${id}`, teacherData);
    }

    // Удалить учителя
    async deleteTeacher(id) {
        return await this.delete(`${this.endpoint}/${id}`);
    }

    // Получить учителей по группе
    async getTeachersByGroup(groupId) {
        return await this.get(`${this.endpoint}/group/${groupId}`);
    }


    // Получить учителя по Telegram username
    async getTeacherByTelegramUsername(username) {
        return await this.get(`${this.endpoint}/telegram/${username}`);
    }

    // Активировать/деактивировать учителя
    async toggleTeacherStatus(teacherId, isActive) {
        return await this.put(`${this.endpoint}/${teacherId}/status`, {
            is_active: isActive
        });
    }

}

export default TeachersAPIClient;
