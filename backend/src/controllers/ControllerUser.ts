import {ModelUser} from "../model/ModelUser";
import {
    IAnswerUser,
    IGetAnswerUser,
    IGetAllUsers, IUser
} from "../interfaces/IUser";

export class ControllerUser {
    User: ModelUser = new ModelUser();

    public async createUser(body: Omit<IUser, 'tgId'>): Promise<IAnswerUser> {
        return await this.User.createUser(body);
    }

    public async registerUser(body: Pick<IUser, 'tgId' | 'tgUsername'>): Promise<IAnswerUser> {
        return await this.User.registerUser(body);
    }

    public async getDataUser(tgUsername: string): Promise<IGetAnswerUser> {
        return await this.User.getDataUser(tgUsername);
    }

    public async getAllUsers(typeUser: any): Promise<IGetAllUsers> {
        return await this.User.getAllUsers(typeUser);
    }

    public async updateUser(data: IUser): Promise<IAnswerUser> {
        return await this.User.updateUser(data);
    }

    public async deleteUser(tgId: string): Promise<IAnswerUser> {
        return await this.User.deleteUser(tgId);
    }
}