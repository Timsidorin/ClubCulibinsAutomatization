//Типизация
import {IEducationGroupCreate, IAddChildren} from "../interfaces/IEducationGroup";
import {ITgUsername, IUuid} from "../interfaces/IUser";
import {IAnswer} from "../interfaces/IAnswer";
//Модель из БД
import {EducationGroup} from "../schemas/EducationGroup";
//Классы для агрегации
import {ModelEducationGroup} from "../model/ModelEducationGroup";

export class ControllerEducationGroup {
    EducationGroup: ModelEducationGroup = new ModelEducationGroup();

    public async createGroup(data: IEducationGroupCreate): Promise<IAnswer<string>> {
        return await this.EducationGroup.createGroup(data);
    }

    public async getAllEducationGroups(tgUsername: unknown): Promise<IAnswer<object> | null> {
        return await this.EducationGroup.getAllGroups(tgUsername);
    }

    public async addChildrens(data: IAddChildren<string>): Promise<IAnswer<string>> {
        return await this.EducationGroup.addChildrens(data);
    }

    public async deleteEducationGroup(uuid: string): Promise<IAnswer<string>> {
        return this.EducationGroup.deleteEducationGroup(uuid);
    }

    public async deleteChildren(uuidUser: ITgUsername | IUuid | string, uuidGroup: string): Promise<IAnswer<string>> {
        return await this.EducationGroup.deleteChildren(uuidUser, uuidGroup);
    }

    public async connectWithGroup(tgUsername: string, uuid: string): Promise<IAnswer<string>> {
        return this.EducationGroup.connectWithGroup(tgUsername, uuid);
    }

    public async updateInfoGroup(body: IEducationGroupCreate): Promise<IAnswer<string>> {
        return await this.EducationGroup.updateInfoGroup(body);
    }

    public async getGroupComposition(uuid: string): Promise<IAnswer<EducationGroup | null>> {
        return await this.EducationGroup.getGroupComposition(uuid);
    }
}