import {ModelAdmin} from "../model/ModelAdmin";
import {IAdmin, IAnswerAdminResponse, IRegisterAdmin} from "../interfaces/IAdmin";

//TODO: ПРОМИСЫ НА ОТВЕТЫ, КОГДА ЭТИ АПИХИ ПОНАДОБЯТСЯ
export class ControllerAdmin {
    Admin: ModelAdmin = new ModelAdmin();

    public async createAdmin(body: IAdmin): Promise<IAnswerAdminResponse> {
        return await this.Admin.createAdmin(body);
    }

    public async registerAdmin(body: IRegisterAdmin) {
        return await this.Admin.registerAdmin(body);
    }

    public async getAdminData(tdId: string) {
        return await this.Admin.getDataAdmin(tdId);
    }
}