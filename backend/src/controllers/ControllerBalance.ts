//Классы для агрегации
import {ModelBalance} from "../model/ModelBalance";
import {ModelBountyLog} from "../model/ModelBountyLog";
//Типизация
import {IFilterLogs} from "../interfaces/IBalance";
import {IAnswer} from "../interfaces/IAnswer";
//Модель из БД
import {BountyLog} from "../schemas/BountyLog";
import {Balance} from "../schemas/Balance";

export class ControllerBalance {
    private ModelBalance: ModelBalance = new ModelBalance();
    private ModelBountyLog: ModelBountyLog = new ModelBountyLog();

    public async updateBalance(tgUsername: string, operation: boolean, summ: number, tgTeacher: string): Promise<IAnswer<object>> {
        //Обновляем баланс и создаем логи о транзакции
        let updateOperation = await this.ModelBalance.updateBalance(tgUsername, operation, summ);
        let updateLog = await this.ModelBountyLog.create({
            tgUsername: tgUsername,
            operation: operation,
            summ: summ,
            tgTeacher: tgTeacher
        });
        return {
            code: updateOperation.code, message: {
                resultOperation: updateOperation.message,
                statusLog: updateLog
            }
        };
    }

    public async getBalance(tgUsername: string): Promise<IAnswer<string | Balance[]>> {
        return await this.ModelBalance.getBalance(tgUsername);
    }

    public async getLogs(body: IFilterLogs): Promise<IAnswer<BountyLog[] | string>> {
        return this.ModelBountyLog.getLogs(body);
    }
}