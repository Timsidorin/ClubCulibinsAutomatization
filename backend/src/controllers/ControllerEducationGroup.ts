import {ModelEducationGroup} from "../model/ModelEducationGroup";
import {IEducationGroupCreate, IAddChildren} from "../interfaces/IEducationGroup";
import {EducationGroup} from "../schemas/EducationGroup";
import {IUser} from "../interfaces/IUser";
import {IAnswerGroup} from "../interfaces/IAnswer";

export class ControllerEducationGroup {
    EducationGroup: ModelEducationGroup = new ModelEducationGroup();

    public async createGroup(data: IEducationGroupCreate): Promise<void> {
        return await this.EducationGroup.createGroup(data);
    }

    public async getAllEducationGroups(tgUsername: unknown): Promise<EducationGroup[] | null> {
        return await this.EducationGroup.getAllGroups(tgUsername);
    }

    public async addChildrens(data: IAddChildren<Pick<IUser, 'tgUsername'>>): Promise<IAnswerGroup<string>> {
        return await this.EducationGroup.addChildrens(data);
    }
}