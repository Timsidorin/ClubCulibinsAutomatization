import {ModelAdmin} from "../model/ModelAdmin";
import {IAdmin, IAnswerAdminResponse, IRegisterAdmin} from "../interfaces/IAdmin";

//TODO: ПРОМИСЫ НА ОТВЕТЫ, КОГДА ЭТИ АПИХИ ПОНАДОБЯТСЯ
export class ControllerAdmin {
    Admin: ModelAdmin = new ModelAdmin();

    public async createAdmin(body: IAdmin): Promise<IAnswerAdminResponse> {
        try {
            return await this.Admin.createAdmin(body);
        } catch (e: any) {
            return {code: e.code, message: e.message};
        }
    }

    public async registerAdmin(body: IRegisterAdmin) {
        try {
            return await this.Admin.registerAdmin(body);
        } catch (e: any) {
            return {code: e.code, message: e.message};
        }
    }

    public async getAdminData(tdId: string) {
        try {
            return await this.Admin.getDataAdmin(tdId);
        } catch (e: any) {
            return {code: e.code, message: e.message};
        }
    }
}