import {Teacher} from "../schemas/Teacher";
import {PersonalData} from "../schemas/PersonalData";
import {
    ICreateTeacher,
    IAnswerTeacher,
    IRegisterTeacher,
    IGetAnswerTeacher,
    IGetAllTeacher
} from "../interfaces/ITeacher";

export class ModelTeacher {
    public async createTeacher(data: ICreateTeacher): Promise<IAnswerTeacher> {
        try {
            let newTeacher: Teacher = await Teacher.create({
                tgUsername: data.tgUsername,
            });
            await PersonalData.create({
                uuidUser: newTeacher.uuid,
                name: data.name,
                secondName: data.secondName,
                lastName: data.lastName,
            })
            return {code: 201, message: 'Новый учитель создан'};
        } catch (e: any) {
            return {code: e.parent.code, message: e.errors[0].path};
        }
    }

    public async registerTeacher(data: IRegisterTeacher): Promise<IAnswerTeacher> {
        try {
            await Teacher.update(
                {tgId: data.tgId,},
                {
                    where: {
                        tgUsername: data.tgUsername
                    }
                });
            return {code: 200, message: "Успешное создание"};
        } catch (e: any) {
            return {code: e.parent.code, message: e.errors[0].path};
        }
    }

    public async getDataTeacher(tgId: string): Promise<IGetAnswerTeacher> {
        try {
            const teacher = await Teacher.findOne({
                where: { tgId },
                include: [{
                    model: PersonalData,
                    required: false,
                }]
            });
            return { code: 200, data: { tgUsername: teacher?.dataValues.tgUsername ?? '',
                    personalData: {
                        name: teacher?.dataValues.PersonalDatum.dataValues.name ?? '',
                        secondName: teacher?.dataValues.PersonalDatum.dataValues.secondName ?? '',
                        lastName: teacher?.dataValues.PersonalDatum.dataValues.lastName ?? '',
                    }
            }};
        } catch (e: any) {
            return {code: e.parent.code, data: e.errors[0].path};
        }
    }

    public async getAllTeachers(): Promise<IGetAllTeacher> {
        try {
            let allTeacher: Teacher[] = await Teacher.findAll(
                {
                    include: [{
                        model: PersonalData,
                        required: false,
                    }]
                }
            );
            return { code: 200, data: allTeacher };
        } catch (e: any) {
            return { code: e.parent.code, data: e.errors[0].path };
        }
    }
}