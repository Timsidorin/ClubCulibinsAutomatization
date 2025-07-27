//Схемы для работы с БД
import {Balance} from "../schemas/Balance";
import {User} from "../schemas/User";
//Типизация
import {IAnswer} from "../interfaces/IAnswer";
import {ITgUsername, IUuid} from "../interfaces/IUser";
//Утилиты
import {sequelize} from "../config/database/database";

export class ModelBalance {
    public async createBalance(uuidUser: string): Promise<void> {
        try {
            await Balance.create({
                uuidUser: uuidUser,
                money: 0,
            });
        } catch (error) {
            throw new Error('Произошла ошибка при создании счета!');
        }
    }

    public async updateBalance(uuidUser: string, operation: boolean, summ: number): Promise<IAnswer<string>> {
        try {
            const operationForBalance = operation ? sequelize.literal(`money + ${summ}`) : sequelize.literal(`money - ${summ}`);
            let oldBalance = await Balance.findOne({where: {uuidUser: uuidUser}});
            if ((!operation) && oldBalance?.dataValues.money < summ) {
                return {code: 500, message: 'Не хватает средств на балансе'}
            }
            await Balance.update(
                {
                    money: operationForBalance,
                },
                {
                    where: {uuidUser: uuidUser}
                });
            return {code: 200, message: 'Успешное обновление счета'}
        } catch {
            throw new Error('Ошибка обновления счета');
        }
    }

    public async getBalance(tgUsername?: string): Promise<IAnswer<string | Balance[]>> {
        try {
            let filter = {};
            if (tgUsername && tgUsername != 'undefined') {
                let user = await User.findOne({
                    where: {tgUsername: tgUsername},
                })

                if (!user) {
                    return {code: 500, message: 'Пользователь не найден'};
                }

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
            return {code: 500, message: 'Произошла ошибка'}
        }
    }

    public async deleteBalance(uuidUser: ITgUsername | IUuid): Promise<void> {
        try {
            if (typeof uuidUser === 'object' && uuidUser !== null && 'uuid' in uuidUser) {
                let r = await Balance.destroy({
                    where: {uuidUser: uuidUser.uuid}
                });
            }
        } catch {
            throw new Error('Произошла ошибка');
        }
    }
}