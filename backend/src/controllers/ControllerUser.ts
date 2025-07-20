//Типизация
import {IUser} from "../interfaces/IUser";
import {User} from "../schemas/User";
//Классы для агрегации
import {ModelBalance} from "../model/ModelBalance";
import {ModelUser} from "../model/ModelUser";
import {IAnswer} from "../interfaces/IAnswer";

export class ControllerUser {
    User: ModelUser = new ModelUser();
    Balance: ModelBalance = new ModelBalance();

    public async createUser(body: Omit<IUser, 'tgId'>): Promise<IAnswer<string>> {
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

    public async registerUser(body: Pick<IUser, 'tgId' | 'tgUsername'>): Promise<IAnswer<string>> {
        return await this.User.registerUser(body);
    }

    public async getDataUser(tgUsername: string): Promise<IAnswer<object>> {
        return await this.User.getDataUser(tgUsername);
    }

    public async getAllUsers(typeUser: any): Promise<IAnswer<User[]>> {
        return await this.User.getAllUsers(typeUser);
    }

    public async updateUser(data: IUser): Promise<IAnswer<string>> {
        return await this.User.updateUser(data);
    }

    public async deleteUser(tgId: string): Promise<IAnswer<string>> {
        return await this.User.deleteUser(tgId);
    }

    public async getUserRole(userName: unknown): Promise<IAnswer<string>> {
        return await this.User.getUserRole(userName);
    }
}