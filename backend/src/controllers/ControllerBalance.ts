import {ModelBalance} from "../model/ModelBalance";

export class ControllerBalance {
    ModelBalance: ModelBalance = new ModelBalance();

    public async updateBalance(tgUsername: string, operation: boolean, summ: number): Promise<object> {
        return await this.ModelBalance.updateBalance(tgUsername, operation, summ);
    }

    public async getBalance(tgUsername: unknown) {
        return await this.ModelBalance.getBalance(tgUsername);
    }
}