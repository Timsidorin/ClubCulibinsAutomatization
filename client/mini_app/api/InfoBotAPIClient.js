import ApiClient from './BaseAPIClient'



class InfoBotAPIClient extends ApiClient {
  constructor() {
    super(__INFO_BOT__URL);
  }

  async sendNotification(payload) {
    return await this.post('/send-notification', payload);
  }

  async getStatus() {
    return await this.get('/status');
  }
}

export default new InfoBotAPIClient();
