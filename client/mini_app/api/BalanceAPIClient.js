import ApiClient from './BaseAPIClient'


class BalanceAPIClient extends ApiClient {
    constructor() {
        super();
        this.endpoint = '/balance';
    }


    async ChildBalanceGet() {
    return await this.get(`${this.endpoint}/get`);
}



}

export default BalanceAPIClient;
