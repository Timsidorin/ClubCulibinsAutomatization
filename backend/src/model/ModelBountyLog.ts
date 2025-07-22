//Схемы для работы с БД
import {BountyLog} from "../schemas/BountyLog";
import {PersonalData} from "../schemas/PersonalData";
import {User} from "../schemas/User";
//Типизация
import {IBalanceLog} from '../interfaces/IBalance'
import {IAnswer} from "../interfaces/IAnswer";
import {IFilterLogs} from "../interfaces/IBalance";
import {Literal} from "sequelize/types/utils";
//Утилиты
import {sequelize} from "../config/database/database";

export class ModelBountyLog {
    public async create(data: IBalanceLog): Promise<boolean> {
        try {
            const teacher= await User.findOne({where: {tgUsername: data.tgTeacher}, attributes: ['uuid']});

            if (!teacher) {
                return false;
            }

            const now = new Date();
            const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            await BountyLog.create({
                uuidTeacher: teacher.uuid,
                uuidChild: data.uuidUser,
                operation: data.operation,
                money: data.summ,
                createdAt: date,
            });
            return true;
        } catch {
            return false;
        }
    }

    public async getLogs(data: IFilterLogs): Promise<IAnswer<BountyLog[] | string>> {
        let filters = Object.fromEntries(
            Object.entries(data)
                .filter(([_, value]) => value !== undefined && !(typeof value === 'number' && isNaN(value)))
                .map(([key, value]) => [key, value])
        );
        let teacher, child;

        if (filters.equalSign) {
            filters.money = this.generateFiterOperation(filters.money, filters.equalSign);
        }

        if (filters.endDate) {
            const startDate = filters.createdAt;
            const endDate = filters.endDate;
            filters.createdAt = sequelize.literal(`"BountyLog"."createdAt" BETWEEN '${startDate}' AND '${endDate}'`);
        }

        if (filters.tgTeacher) {
            teacher = await User.findOne({where: {tgUsername: filters.tgTeacher}, attributes: ['uuid']});
            filters.uuidTeacher = teacher?.uuid;
        }
        //Удаляем ненужные поля
        delete filters.tgTeacher;
        delete filters.equalSign;
        delete filters.endDate;
        try {
            let searchLogs = await BountyLog.findAll({
                where: {...filters},
                include: [
                    {
                        model: User,
                        as: 'Teacher',
                        include: [{
                            model: PersonalData,
                        }]
                    },
                    {
                        model: User,
                        as: 'Child',
                        include: [{
                            model: PersonalData,
                        }]
                    }
                ]
            });
            return {code: 200, message: searchLogs}
        } catch (e) {
            console.log(e);
            return {code: 500, message: 'Произошла ошибка'}
        }
    }

    private generateFiterOperation(number: number, operation: number): Literal | undefined {
        switch (operation) {
            case 1:
                return sequelize.literal(`${number} = money`);
            case 2:
                return sequelize.literal(`${number} > money`);
            case 3:
                return sequelize.literal(`${number} < money`);
        }
    }
}