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

}

export default GroupsAPIClient;
