import {ModelUser} from "../model/ModelUser";
import {
    IAnswerUser,
    IGetAnswerUser,
    IGetAllUsers, IUser
} from "../interfaces/IUser";
import {ModelBalance} from "../model/ModelBalance";

export class ControllerUser {
    User: ModelUser = new ModelUser();
    Balance: ModelBalance = new ModelBalance();

    public async createUser(body: Omit<IUser, 'tgId'>): Promise<IAnswerUser<string>> {
        try {
            let answerUser = await this.User.createUser(body);
            if (answerUser.code === 201) {
                if (body.typeUser === 3) {
                    await this.Balance.createBalance(answerUser.message)
                }
                return {code: answerUser.code, message: 'Успешное создание'};
            }
            return {code: answerUser.code, message: answerUser.message};
        } catch (error: any) {
            return error;
        }
    }

    public async registerUser(body: Pick<IUser, 'tgId' | 'tgUsername'>): Promise<IAnswerUser<string>> {
        return await this.User.registerUser(body);
    }

    public async getDataUser(tgUsername: string): Promise<IGetAnswerUser> {
        return await this.User.getDataUser(tgUsername);
    }

    public async getAllUsers(typeUser: any): Promise<IGetAllUsers> {
        return await this.User.getAllUsers(typeUser);
    }

    public async updateUser(data: IUser): Promise<IAnswerUser<string>> {
        return await this.User.updateUser(data);
    }

    public async deleteUser(tgId: string): Promise<IAnswerUser<string>> {
        return await this.User.deleteUser(tgId);
    }

    public async getUserRole(userName: unknown): Promise<IAnswerUser<string>> {
        return await this.User.getUserRole(userName);
    }
}