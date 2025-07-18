import ApiClient from './BaseAPIClient'


class BalanceAPIClient extends ApiClient {
    constructor() {
        super();
        this.endpoint = '/balance';
    }


    async ChildBalanceGet() {
    return await this.get(`${this.endpoint}/get`);
}

    async BalanceLogs(LogsData) {
    const params = {};
    if (LogsData?.tgTeacher) params.tgTeacher = LogsData.tgTeacher;
    if (LogsData?.tgChild) params.tgChild = LogsData.tgChild;
    if (LogsData?.operation) params.operation = LogsData.operation;
    if (LogsData?.summ) params.summ = LogsData.summ;
    if (LogsData?.startDate) params.startDate = LogsData.startDate;
    if (LogsData?.endDate) params.endDate = LogsData.endDate;
    if (LogsData?.equalSign && LogsData?.summ) params.equalSign = LogsData.equalSign;
    const response = await this.client.get(`${this.endpoint}/logs`, { params });
    return response.data;
}

}

export default BalanceAPIClient;
