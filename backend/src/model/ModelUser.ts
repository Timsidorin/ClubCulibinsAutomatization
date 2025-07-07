import {User} from "../schemas/User";
import {PersonalData} from "../schemas/PersonalData";
import {
    IUser,
    IAnswerUser,
    IGetAnswerUser,
    IGetAllUsers
} from "../interfaces/IUser";
import {sequelize} from "../config/database/database";

export class ModelUser {
    public async createUser(data: Omit<IUser, 'tgId'>): Promise<IAnswerUser> {
        try {
            let newUser: User = await User.create({
                tgUsername: data.tgUsername,
                typeUser: data.typeUser
            });
            await PersonalData.create({
                uuidUser: newUser.uuid,
                name: data.name,
                secondName: data.secondName,
                lastName: data.lastName,
            })
            return {code: 201, message: 'Новый пользователь создан'};
        } catch (e: any) {
            return {code: e.parent.code, message: e.errors[0].path};
        }
    }

    public async registerUser(data: Pick<IUser, 'tgId' | 'tgUsername'>): Promise<IAnswerUser> {
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

    public async getDataUser(tgUsername: string): Promise<IGetAnswerUser> {
        try {
            const user = await User.findOne({
                where: { tgUsername },
                include: [{
                    model: PersonalData,
                    required: false,
                }]
            });
            return { code: 200, data: { tgUsername: user?.dataValues.tgUsername ?? '',
                    personalData: {
                        name: user?.dataValues.PersonalDatum.dataValues.name ?? '',
                        secondName: user?.dataValues.PersonalDatum.dataValues.secondName ?? '',
                        lastName: user?.dataValues.PersonalDatum.dataValues.lastName ?? '',
                    }
            }};
        } catch (e: any) {
            return {code: e.parent.code, data: e.errors[0].path};
        }
    }

    public async getAllUsers(typeUser: any): Promise<IGetAllUsers> {
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
            return { code: 200, data: allUsers };
        } catch (e: any) {
            return { code: e.parent.code, data: e.errors[0].path };
        }
    }

    public async updateUser(data: IUser): Promise<IAnswerUser> {
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

    public async deleteUser(tgUsername: string): Promise<IAnswerUser> {
        const transaction = await sequelize.transaction();
        try {
            const user = await User.findOne({
                where: { tgUsername },
                transaction
            });

            if (!user) {
                return {code: 500, message: 'Пользователь не найден'};
            }

            let uuid: string = user?.dataValues.uuid ?? '';
            await PersonalData.destroy({
                where: { uuidUser: uuid },
                transaction
            });
            await user.destroy({ transaction });
            await transaction.commit();
            return {code: 200, message: 'Пользователь удален'};
        } catch (error) {
            return {code: 500, message: 'Произошла ошибка'};
        }
    }
}