import {ModelBalance} from "../model/ModelBalance";
import {IAnswer} from "../interfaces/IAnswer";
import {ModelBountyLog} from "../model/ModelBountyLog";
import {IFilterLogs} from "../interfaces/IBalance";
import {BountyLog} from "../schemas/BountyLog";

export class ControllerBalance {
    ModelBalance: ModelBalance = new ModelBalance();
    ModelBountyLog: ModelBountyLog = new ModelBountyLog();

    public async updateBalance(tgUsername: string, operation: boolean, summ: number, tgTeacher: string): Promise<IAnswer<object>> {
        let updateOperation = await this.ModelBalance.updateBalance(tgUsername, operation, summ);
        let updateLog = await this.ModelBountyLog.create({tgUsername: tgUsername, operation: operation, summ: summ, tgTeacher: tgTeacher});
        return {code: updateOperation.code, message: {resultOperation: updateOperation.message, statusLog: updateLog}};
    }

    public async getBalance(tgUsername: unknown) {
        return await this.ModelBalance.getBalance(tgUsername);
    }

    public async getLogs(body: IFilterLogs): Promise<IAnswer<BountyLog[] | string>>  {
        return this.ModelBountyLog.getLogs(body);
    }
}