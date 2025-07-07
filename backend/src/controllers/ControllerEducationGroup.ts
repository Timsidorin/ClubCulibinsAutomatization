import {ModelEducationGroup} from "../model/ModelEducationGroup";
import {IEducationGroupCreate} from "../interfaces/IEducationGroup";
import {EducationGroup} from "../schemas/EducationGroup";

export class ControllerEducationGroup {
    EducationGroup: ModelEducationGroup = new ModelEducationGroup();

    public async createGroup(data: IEducationGroupCreate): Promise<void> {
        return await this.EducationGroup.createGroup(data);
    }

    public async getAllEducationGroups(tgUsername: unknown): Promise<EducationGroup[] | null> {
        return await this.EducationGroup.getAllGroups(tgUsername);
    }

}