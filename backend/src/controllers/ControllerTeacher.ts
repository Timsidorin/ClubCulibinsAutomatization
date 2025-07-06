import {ModelTeacher} from "../model/ModelTeacher";
import {
    IAnswerTeacher,
    IGetAnswerTeacher,
    IGetAllTeacher, ITeacher
} from "../interfaces/ITeacher";

export class ControllerTeacher {
    Teacher: ModelTeacher = new ModelTeacher();

    public async createTeacher(body: Omit<ITeacher, 'tgId'>): Promise<IAnswerTeacher> {
        return await this.Teacher.createTeacher(body);
    }

    public async registerTeacher(body: Pick<ITeacher, 'tgId' | 'tgUsername'>): Promise<IAnswerTeacher> {
        return await this.Teacher.registerTeacher(body);
    }

    public async getDataTeacher(tgId: string): Promise<IGetAnswerTeacher> {
        return await this.Teacher.getDataTeacher(tgId);
    }

    public async getAllTeacher(): Promise<IGetAllTeacher> {
        return await this.Teacher.getAllTeachers();
    }

    public async updateTeacher(data: ITeacher): Promise<IAnswerTeacher> {
        return await this.Teacher.updateTeacher(data);
    }

    public async deleteTeacher(tgId: string): Promise<IAnswerTeacher> {
        return await this.Teacher.deleteTeacher(tgId);
    }
}