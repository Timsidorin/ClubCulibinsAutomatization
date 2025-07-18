import {Balance} from "../schemas/Balance";
import {User} from "../schemas/User";
import {sequelize} from "../config/database/database";
import {IAnswer} from "../interfaces/IAnswer";

export class ModelBalance {
    public async createBalance(uuidUser: string) {
        try {
            await Balance.create({
                uuidUser: uuidUser,
                money: 0,
            });
        } catch (error) {
            throw new Error('Произошла ошибка при создании счета!');
        }
    }

    public async updateBalance(tgUsername: string, operation: boolean, summ: number): Promise<IAnswer<string>> {
        try {
            let uuid = await User.findOne({
                where: {tgUsername: tgUsername},
                attributes: ['uuid'],
            })
            const operationForBalance = operation ? sequelize.literal(`money + ${summ}`) : sequelize.literal(`money - ${summ}`);
            let oldBalance = await Balance.findOne({where: {uuidUser: uuid?.uuid}});
            if ((!operation) && oldBalance?.dataValues.money < summ) {
                return {code: 500, message: 'Не хватает средств на балансе'}
            }
            await Balance.update(
                {
                    money:  operationForBalance,
                },
                {
                    where: {uuidUser: uuid?.uuid}
                });
            return {code: 200, message: 'Успешное обновление счета'}
        } catch {
            throw new Error('Ошибка обновления счета');
        }
    }

    public async getBalance(tgUsername?: unknown) {
            try {
                let filter = {};
                if (tgUsername) {
                    let user = await User.findOne({
                        where: {tgUsername: tgUsername},
                    })
                    filter = {uuidUser: user?.uuid};
                }
                let balances = await Balance.findAll(
                    {
                        where: {...filter},
                        include: [{
                            model: User,
                            required: false,
                        }],
                    });
                return {code: 200, message: balances.length > 0 ? balances : 'Нет данных'}
            } catch {
                throw new Error('Не удалось обратиться к балансу');
            }
        }
}