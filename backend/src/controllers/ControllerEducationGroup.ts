import {ModelEducationGroup} from "../model/ModelEducationGroup";
import {IEducationGroupCreate, IAddChildren} from "../interfaces/IEducationGroup";
import {IUser} from "../interfaces/IUser";
import {IAnswerGroup} from "../interfaces/IAnswer";

export class ControllerEducationGroup {
    EducationGroup: ModelEducationGroup = new ModelEducationGroup();

    public async createGroup(data: IEducationGroupCreate): Promise<void> {
        return await this.EducationGroup.createGroup(data);
    }

    public async getAllEducationGroups(tgUsername: unknown): Promise<IAnswerGroup<object> | null> {
        return await this.EducationGroup.getAllGroups(tgUsername);
    }

    public async addChildrens(data: IAddChildren<Pick<IUser, 'tgUsername'>>): Promise<IAnswerGroup<string>> {
        return await this.EducationGroup.addChildrens(data);
    }

    public async deleteEducationGroup(uuid: string): Promise<IAnswerGroup<string>> {
        return this.EducationGroup.deleteEducationGroup(uuid);
    }

    public async deleteChildren(uuid: string): Promise<IAnswerGroup<string>> {
        return await this.EducationGroup.deleteChildren(uuid);
    }

    public async connectWithGroup(tgUsername: string, uuid: string): Promise<IAnswerGroup<string>> {
        return this.EducationGroup.connectWithGroup(tgUsername, uuid);
    }

    public async updateInfoGroup(body: IEducationGroupCreate): Promise<IAnswerGroup<string>> {
        return await this.EducationGroup.updateInfoGroup(body);
    }
}