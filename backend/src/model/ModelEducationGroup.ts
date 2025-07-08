import {EducationGroup} from "../schemas/EducationGroup";
import {IEducationGroupCreate} from "../interfaces/IEducationGroup";
import {User} from "../schemas/User";
import {sequelize} from "../config/database/database";

export class ModelEducationGroup {
    public async createGroup(data: IEducationGroupCreate): Promise<void> {
        const transaction = await sequelize.transaction();
        try {
            const teacher = await User.findOne({
                where: {
                    tgUsername: data.tgUsername,
                    typeUser: 1
                },
                attributes: ['uuid'],
                transaction
            });
            if (!teacher) {
                throw new Error(`Учитель с tgUsername "${data.tgUsername}" (type=1) не найден`);
            }
            await EducationGroup.create({
                name: data.name,
                uuidUser: teacher?.uuid
            }, { transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            if (error instanceof Error && error.message.includes('Учитель')) {
                throw error;
            }
            throw new Error(`Ошибка создания группы: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
        }
    }

    public async getAllGroups(tgUsername: unknown): Promise<EducationGroup[] | null> {
        try {
            let uuidUser = {};
            if (tgUsername) {
                const teacher = await User.findOne({
                    where: {
                        tgUsername: tgUsername,
                        typeUser: 1
                    },
                    attributes: ['uuid'],
                });
                if (!teacher) {
                    throw new Error(`Учитель с tgUsername "${tgUsername}" (type=1) не найден`);
                }
                uuidUser = {uuidUser: teacher?.uuid};
            }
            return await EducationGroup.findAll({
                where: {...uuidUser},
            })
        } catch (error) {
            console.error(error);
            throw new Error('Ошибка получения групп');
        }
    }
}