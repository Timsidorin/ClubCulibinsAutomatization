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
    return await this.put(`${this.endpoint}/update-group`, groupData);
  }


  // Удалить группу
  async deleteGroup(uuid_group) {
    return await this.delete(`${this.endpoint}/${uuid_group}`);
  }

   // Привязать учителя к группе
  async SnapTeacher(SnapData) {
    return await this.post(`${this.endpoint}/add-teacher`, SnapData);
  }

  // Отвязать  учителя от группы
  async UntieTeacher(uuid_group) {
      const data = { uuid: uuid_group };
    return await this.post(`${this.endpoint}/add-teacher`, data);
  }

  // Добавить множество детей в группу
  async addChildrens(addData) {
    return await this.post(`${this.endpoint}/add-childrens`, addData);
  }



}

export default GroupsAPIClient;
