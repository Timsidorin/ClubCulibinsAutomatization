import {EducationGroup} from "../schemas/EducationGroup";
import {IAddChildren, IEducationGroupCreate} from "../interfaces/IEducationGroup";
import {User} from "../schemas/User";
import {EducationGroupMember} from "../schemas/EducationGroupMember";
import {IUser} from "../interfaces/IUser";
import {sequelize} from "../config/database/database";
import {IAnswerGroup} from "../interfaces/IAnswer";

export class ModelEducationGroup {
    public async createGroup(data: Omit<IEducationGroupCreate, 'uuidUser'>): Promise<void> {
        const transaction = await sequelize.transaction();
        try {
            let teacher: User | null;
            let insertData = {};
            if (data.tgUsername) {
                teacher = await User.findOne({
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
                insertData = {uuidUser: teacher?.uuid, ...data};
            }
            await EducationGroup.create({
                ...insertData
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

    public async addChildrens(data: IAddChildren<Pick<IUser, 'tgUsername'>>): Promise<IAnswerGroup<string>> {
        try {
            let dataInsert: any = [];
            data.childrens.forEach((children) => {
                dataInsert.push({uuidGroup: data.uuidGroup, tgUsername: children});
            });
            console.log(dataInsert);
            await EducationGroupMember.bulkCreate(dataInsert);
            return {code: 200, message: 'Успешное заполнение группы'};
        } catch (error) {
            throw new Error(`Произошла ошибка при создании`);
        }
    }
}