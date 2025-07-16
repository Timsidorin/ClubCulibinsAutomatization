import ApiClient from './BaseAPIClient'

class TeachersAPIClient extends ApiClient {
    constructor() {
        super();
        this.endpoint = '/user';
    }


    async getAllTeachers(type) {
    return await this.get(`${this.endpoint}/get/all?type=${type}`);
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
    async deleteTeacher(tgUsername) {
        return await this.delete(`${this.endpoint}/${tgUsername}`);
    }

    // Получить учителей по группе
    async getTeachersByGroup(groupId) {
        return await this.get(`${this.endpoint}/group/${groupId}`);
    }


    // Получить учителя по Telegram username
    async getTeacherByTelegramUsername(username) {
        return await this.get(`${this.endpoint}/telegram/${username}`);
    }


}

export default TeachersAPIClient;
