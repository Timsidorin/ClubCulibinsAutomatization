//Схемы для работы с БД
import {EducationGroup} from "../schemas/EducationGroup";
import {User} from "../schemas/User";
import {PersonalData} from "../schemas/PersonalData";
import {Balance} from "../schemas/Balance";
import {EducationGroupMember} from "../schemas/EducationGroupMember";
//Типизация
import {IAddChildren, IEducationGroupCreate} from "../interfaces/IEducationGroup";
import {IUser} from "../interfaces/IUser";
import {IAnswer} from "../interfaces/IAnswer";
//Утилиты
import {sequelize} from "../config/database/database";

export class ModelEducationGroup {
    public async createGroup(data: IEducationGroupCreate): Promise<IAnswer<string>> {
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
                    return {code: 500, message: `Учитель с tgUsername "${data.tgUsername}" (type=1) не найден`};
                }

                insertData['uuidUser'] = teacher?.uuid;
                if (data.urlName) {
                    let name = data.urlName.match(/\/([^\/\s]+)/);
                    if (name) {
                        insertData.urlName = name[1];
                    }
                }
            }
            await EducationGroup.create({
                ...insertData
            }, {transaction});

            await transaction.commit();
            return {code: 200, message: 'Успешное создание'}
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
            let usernames: string[] = [];
            if (tgUsername) {
                if (Array.isArray(tgUsername)) {
                    usernames = tgUsername as string[];
                } else if (typeof tgUsername === 'string') {
                    usernames = tgUsername.split(',');
                } else {
                    usernames = [tgUsername as string];
                }
            }
            if (usernames.length > 0) {
                const teachers = await User.findAll({
                    where: {
                        tgUsername: usernames,
                        typeUser: 1,
                    },
                    include: [{
                        model: PersonalData,
                        required: false,
                    }],
                });

                if (!teachers || teachers.length === 0) {
                    throw new Error(`Учителя с tgUsername ${usernames.join(', ')} (type=1) не найдены`);
                }

                uuidUser = {uuidUser: teachers.map(teacher => teacher.uuid)};
            }

            let groups = await EducationGroup.findAll({
                where: {...uuidUser},
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
            return {code: 200, message: answer};
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Ошибка получения групп');
        }
    }

// Всё правильно, если childrens - это string[]
    public async addChildrens(data: IAddChildren<string>): Promise<IAnswer<string>> {
        try {
            const dataInsert = data.childrens.map(uuidUser => ({
                uuidGroup: data.uuidGroup,
                uuidUser
            }));

            await EducationGroupMember.bulkCreate(dataInsert);
            return {code: 200, message: 'Успешное заполнение группы'};
        } catch (error) {
            throw new Error(`Произошла ошибка при создании: ${error instanceof Error ? error.message : String(error)}`);
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

    public async deleteChildren(uuidUser: string, uuidGroup: string): Promise<IAnswer<string>> {
        try {
            await EducationGroupMember.destroy({
                where: {uuidUser: uuidUser, uuidGroup: uuidGroup},
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

    public async getGroupComposition(uuid: string): Promise<IAnswer<EducationGroup | null>> {
        try {
            let composition = await EducationGroup.findOne({
                where: {uuid},
                include: [{
                    model: EducationGroupMember,
                    required: false,
                    include: [{
                        model: User,
                        required: false,
                        include: [
                            {
                                model: PersonalData,
                                required: false,
                            },
                            {
                                model: Balance,
                                required: false,
                            }
                        ],
                    }]
                }]
            });
            return {code: 200, message: composition};
        } catch {
            throw new Error(`Не удалось найти состав группы`);
        }
    }
}