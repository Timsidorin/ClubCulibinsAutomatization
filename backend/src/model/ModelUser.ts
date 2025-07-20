//Схемы для работы с БД
import {User} from "../schemas/User";
import {PersonalData} from "../schemas/PersonalData";
//Типизация
import {IUser} from "../interfaces/IUser";
import {IAnswer} from "../interfaces/IAnswer";
//Утилиты
import {sequelize} from "../config/database/database";

export class ModelUser {
    public async createUser(data: Omit<IUser, 'tgId'>): Promise<IAnswer<string>> {
        try {
            let newUser: User = await User.create({
                tgUsername: data.tgUsername,
                typeUser: data.typeUser
            });
            const userData: Omit<IUser, 'tgId'> = {...data};
            await PersonalData.create({
                uuidUser: newUser.uuid,
                ...userData
            })
            return {code: 201, message: newUser.uuid};
        } catch (e: any) {
            return {code: 500, message: e.parent.code};
        }
    }

    public async registerUser(data: Pick<IUser, 'tgId' | 'tgUsername'>): Promise<IAnswer<string>> {
        try {
            await User.update(
                {tgId: data.tgId,},
                {
                    where: {
                        tgUsername: data.tgUsername
                    }
                });
            return {code: 200, message: "Успешная регистрация"};
        } catch (e: any) {
            return {code: e.parent.code, message: e.errors[0].path};
        }
    }

    public async getDataUser(tgUsername: string): Promise<IAnswer<object>> {
        try {
            const user = await User.findOne({
                where: {tgUsername},
                include: [{
                    model: PersonalData,
                    required: false,
                }]
            });
            return {
                code: 200, message: {
                    tgUsername: user?.dataValues.tgUsername ?? '',
                    personalData: {
                        name: user?.dataValues.PersonalDatum.dataValues.name ?? '',
                        secondName: user?.dataValues.PersonalDatum.dataValues.secondName ?? '',
                        lastName: user?.dataValues.PersonalDatum.dataValues.lastName ?? '',
                    }
                }
            };
        } catch (e: any) {
            return {code: e.parent.code, message: e.errors[0].path};
        }
    }

    public async getAllUsers(typeUser: any): Promise<IAnswer<User[]>> {
        const filters: Record<string, any> = {};
        if (typeUser) filters.typeUser = typeUser;
        try {
            let allUsers: User[] = await User.findAll({
                include: [{
                    model: PersonalData,
                    required: false,
                }],
                where: Object.keys(filters).length ? filters : {}
            });
            return {code: 200, message: allUsers};
        } catch (e: any) {
            return {code: e.parent.code, message: e.errors[0].path};
        }
    }

    public async updateUser(data: IUser): Promise<IAnswer<string>> {
        try {
            let userData = await User.findOne({
                where: {tgUsername: data.tgUsername}
            });
            let uuid: string = userData?.dataValues.uuid ?? '';
            await PersonalData.update(
                {...data},
                {
                    where: {
                        uuidUser: uuid
                    }
                })
            return {code: 200, message: 'Успешное обновление'};
        } catch (e: any) {
            return {code: 500, message: 'Произошла ошибка'};
        }
    }

    public async deleteUser(tgUsername: string): Promise<IAnswer<string>> {
        const transaction = await sequelize.transaction();
        try {
            const user = await User.findOne({
                where: {tgUsername},
                transaction
            });

            if (!user) {
                return {code: 500, message: 'Пользователь не найден'};
            }

            let uuid: string = user?.dataValues.uuid ?? '';
            await PersonalData.destroy({
                where: {uuidUser: uuid},
                transaction
            });
            await user.destroy({transaction});
            await transaction.commit();
            return {code: 200, message: 'Пользователь удален'};
        } catch (error) {
            return {code: 500, message: 'Произошла ошибка'};
        }
    }

    public async getUserRole(tgUsername: unknown): Promise<IAnswer<string>> {
        try {
            let user = await User.findOne({
                where: {tgUsername: tgUsername}
            });
            if (!user) {
                return {code: 500, message: 'Такого юзера нет'};
            }
            return {code: 200, message: `${user?.typeUser}`};
        } catch {
            return {code: 500, message: 'Произошла ошибка'};
        }
    }
}