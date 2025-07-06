import {ModelTeacher} from "../model/ModelTeacher";
import {
    ICreateTeacher,
    IRegisterTeacher,
    IAnswerTeacher,
    IGetAnswerTeacher,
    IGetAllTeacher
} from "../interfaces/ITeacher";

export class ControllerTeacher {
    Teacher: ModelTeacher = new ModelTeacher();

    public async createTeacher(body: ICreateTeacher): Promise<IAnswerTeacher> {
        return await this.Teacher.createTeacher(body)
    }

    public async registerTeacher(body: IRegisterTeacher): Promise<IAnswerTeacher> {
        return await this.Teacher.registerTeacher(body)
    }

    public async getDataTeacher(tgId: string): Promise<IGetAnswerTeacher> {
        return await this.Teacher.getDataTeacher(tgId);
    }

    public async getAllTeacher(): Promise<IGetAllTeacher> {
        return await this.Teacher.getAllTeachers();
    }
}