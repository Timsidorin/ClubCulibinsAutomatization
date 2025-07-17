import {BountyLog} from "../schemas/BountyLog";
import {IBalanceLog} from '../interfaces/IBalance'
import {User} from "../schemas/User";
import {IAnswer} from "../interfaces/IAnswer";
import {IFilterLogs} from "../interfaces/IBalance";
import {sequelize} from "../config/database/database";
import {PersonalData} from "../schemas/PersonalData";

export class ModelBountyLog {
    public async create(data: IBalanceLog): Promise<boolean> {
        try {
            const [teacher, child] = await Promise.all([
                User.findOne({ where: { tgUsername: data.tgTeacher }, attributes: ['uuid'] }),
                User.findOne({ where: { tgUsername: data.tgUsername }, attributes: ['uuid'] }),
            ]);

            if (!teacher || !child) {
                return false;
            }

            const now = new Date();
            const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            await BountyLog.create({
                uuidTeacher: teacher.uuid,
                uuidChild: child.uuid,
                operation: data.operation,
                money: data.summ,
                createdAt: date,
            });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public async getLogs(data: IFilterLogs): Promise<IAnswer<BountyLog[] | string>> {
        //Мб это и можно было как-то улучшить, но я пока не знаю
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
            filters.createdAt = sequelize.literal(`"createdAt" BETWEEN '${startDate}' AND '${endDate}'`);
        }

        if (filters.tgTeacher) {
            teacher = await User.findOne({ where: { tgUsername: filters.tgTeacher }, attributes: ['uuid'] });
            filters.uuidTeacher = teacher?.uuid;
        }

        if (filters.tgChild) {
            child = await User.findOne({ where: { tgUsername: filters.tgChild }, attributes: ['uuid'] });
            delete filters.tgChild;
            filters.uuidChild = child?.uuid;
        }
        //Удаляем ненужные поля
        delete filters.tgTeacher;
        delete filters.equalSign;
        delete filters.endDate;
        try {
            let searchLogs = await BountyLog.findAll({
                where: { ...filters },
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
        } catch(e) {
            console.log(e);
            return {code: 500, message: 'Произошла ошибка'}
        }
    }

    private generateFiterOperation(number: number, operation: number): any {
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