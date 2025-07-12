import {EducationGroup} from "../schemas/EducationGroup";
import {IAddChildren, IEducationGroupCreate} from "../interfaces/IEducationGroup";
import {User} from "../schemas/User";
import {EducationGroupMember} from "../schemas/EducationGroupMember";
import {IUser} from "../interfaces/IUser";
import {sequelize} from "../config/database/database";
import {IAnswer} from "../interfaces/IAnswer";
import {PersonalData} from "../schemas/PersonalData";

export class ModelEducationGroup {
    public async createGroup(data: IEducationGroupCreate): Promise<void> {
        const transaction = await sequelize.transaction();
        try {
            let teacher: User | null;
            let insertData = {...data};
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

                insertData['uuidUser'] = teacher?.uuid;
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

    public async getAllGroups(tgUsername: unknown): Promise<IAnswer<object> | null> {
        try {
            let uuidUser = {};
            let answer = {groups: {}};
            if (tgUsername) {
                const teacher = await User.findOne({
                    where: {
                        tgUsername: tgUsername,
                        typeUser: 1,
                    },
                    include: [{
                        model: PersonalData,
                        required: false,
                    }],
                });
                if (!teacher) {
                    throw new Error(`Учитель с tgUsername "${tgUsername}" (type=1) не найден`);
                }
                uuidUser = {uuidUser: teacher?.uuid};
            }
            let groups = await EducationGroup.findAll({
                where: { ...uuidUser },
                include: [
                    {
                        model: User,
                        required: false,
                        include: [{
                            model: PersonalData,
                            required: false,
                        }]
                    },
                    {
                        model: EducationGroupMember,
                        required: false,
                        include: [{
                            model: User,
                            required: false,
                            include: [{
                                model: PersonalData,
                                required: false,
                            }]
                        }]
                    }
                ],
            });
            answer.groups = groups;
            console.log(groups);
            return {code: 200, message: answer};
        } catch (error) {
            console.log(error);
            throw new Error('Ошибка получения групп');
        }
    }

    public async addChildrens(data: IAddChildren<Pick<IUser, 'tgUsername'>>): Promise<IAnswer<string>> {
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

    public async deleteEducationGroup(uuid: string): Promise<IAnswer<string>> {
        try {
            await EducationGroup.destroy({
                where: {uuid}
            })
            return {code: 200, message: 'Успешное удаление'};
        } catch {
            throw new Error(`Произошла ошибка, обратитесь к админу!`);
        }
    }

    public async deleteChildren(tgUsername: string): Promise<IAnswer<string>> {
        try {
            await EducationGroupMember.destroy({
                where: {tgUsername}
            })
            return {code: 200, message: 'Успешное удаление'};
        } catch {
            throw new Error(`Обратитесь к админу`);
        }
    }

    public async connectWithGroup(tgUsername: string, uuid: string): Promise<IAnswer<string>> {
        try {
            let teacher: User | null = null;

            if (tgUsername) {
                teacher = await User.findOne({
                    where: {tgUsername},
                    attributes: ['uuid'],
                })
            }

            await EducationGroup.update(
                {
                    uuidUser: teacher?.uuid ?? null,
                },
                {
                    where: {uuid}
                });
            return {code: 200, message: 'Успешное назначение'}
        } catch {
            throw new Error(`Произошла ошибка`);
        }
    }

    public async updateInfoGroup(body: IEducationGroupCreate): Promise<IAnswer<string>> {
        try {
            await EducationGroup.update(
                {
                    ...body,
                },
                {
                    where: {uuid: body.uuid},
                });
            return {code: 200, message: 'Успешное обновление данных'};
        } catch {
            throw new Error('Произошла ошибка');
        }
    }
}