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
    async createTeacher(groupData) {
        return await this.post(`${this.endpoint}/create`, groupData);
    }

}

export default GroupsAPIClient;
