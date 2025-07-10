// api/ChildrenAPIClient.js
import ApiClient from './BaseAPIClient'

class ChildrenAPIClient extends ApiClient {
  constructor() {
    super();
    this.endpoint = '/user';
  }

  // Получить всех детей
  async getAllChildren(type) {
    return await this.get(`${this.endpoint}/get/all?type=${type}`);
  }

  // Получить ребенка по tgUsername
  async getChildByTgUsername(tgUsername) {
    return await this.get(`${this.endpoint}/${tgUsername}`);
  }

  // Создать нового ребенка
  async createChild(childData) {
    return await this.post(`${this.endpoint}/create`, childData);
  }

  // Обновить данные ребенка
  async updateChild(tgUsername, childData) {
    return await this.put(`${this.endpoint}/${tgUsername}`, childData);
  }

  // Удалить ребенка по tgUsername
  async deleteChild(tgUsername) {
    return await this.delete(`${this.endpoint}/${tgUsername}`);
  }
}

export default ChildrenAPIClient;
