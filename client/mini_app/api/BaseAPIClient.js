import axios from 'axios';



class ApiClient {
    constructor(baseUrl = __BASE__URL__, defaultHeaders = {}) {
        this.client = axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/json',
                ...defaultHeaders
            }
        });
    }

    // GET запрос
    async get(endpoint) {
        const response = await this.client.get(endpoint);
        return response.data;
    }

    // POST запрос
    async post(endpoint, data) {
        const response = await this.client.post(endpoint, data);
        return response.data;
    }

    // PUT запрос
    async put(endpoint, data) {
        const response = await this.client.put(endpoint, data);
        return response.data;
    }

    // DELETE запрос
    async delete(endpoint) {
        const response = await this.client.delete(endpoint);
        return response.data;
    }

}

export default ApiClient;
