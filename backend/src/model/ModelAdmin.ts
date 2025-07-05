import {Admin} from "../schemas/Admin";
import {PersonalData} from "../schemas/PersonalData";
import {
    IAdmin,
    ICreateAdminResponse,
    IRegisterAdmin,
    IRegisterAdminResponse
} from "../interfaces/IAdmin";
import {sequelize} from "../config/database/database";
import {QueryTypes} from "sequelize";


export class ModelAdmin {
    //Создаем админа, без tg id
    public async createAdmin(body: IAdmin): Promise<ICreateAdminResponse> {
        try {
            let newAdmin: Admin = await Admin.create(
                {
                    tgUsername: body.tgUsername,
                }
            );
            await PersonalData.create(
                {
                    uuidUser: newAdmin.uuid,
                    name: body.name,
                    secondName: body.secondName,
                    lastName: body.lastName,
                }
            )
            return {code: 201, message: "Успех"};
        } catch (e: any) {
            return {code: e.parent.code, message: e.errors[0].path};
        }
    }

    //Записываем в таблицу tg id
    public async registerAdmin(body: IRegisterAdmin): Promise<IRegisterAdminResponse> {
        try {
            await Admin.update(
                {tgId: body.tgId,},
                {
                    where: {
                        tgUsername: body.tgUsername
                    }
                });
            return {code: 200, message: "Успешное создание"};
        } catch (e: any) {
            return {code: e.parent.code, message: e.errors[0].path};
        }
    }

    //Получаем данные по пользователю
    public async getDataAdmin(tgId: string) {
        try {
            const admin = await Admin.findOne({
                where: { tgId },
                include: [{
                    model: PersonalData,
                    required: false,
                }]
            });
            return { code: 200, message: admin };
        } catch (error: any) {
            return { code: 500, message: error.message };
        }
    }
}