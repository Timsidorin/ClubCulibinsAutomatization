import ApiClient from './BaseAPIClient'

class GroupsAPIClient extends ApiClient {
    constructor() {
        super();
        this.endpoint = '/education-group';
    }


    async getAllGroups() {
        return await this.get(`${this.endpoint}/get-all`);
    }
     // Создать новую группу
    async createGroup(groupData) {
        return await this.post(`${this.endpoint}/create`, groupData);
    }

    // Обновить данные группы
  async updateGroup(groupData) {
    return await this.put(`${this.endpoint}`, groupData);
  }


   // Привязать учителя к группе
  async SnapTeacher(SnapData) {
    return await this.put(`${this.endpoint}/add-teacher`, SnapData);
  }


}

export default GroupsAPIClient;
