//Типизация
import {IUser} from "../interfaces/IUser";
import {User} from "../schemas/User";
import {ITgUsername, IUuid} from "../interfaces/IUser";
import {IAnswer} from "../interfaces/IAnswer";
//Классы для агрегации
import {ModelBalance} from "../model/ModelBalance";
import {ModelUser} from "../model/ModelUser";
import {ModelEducationGroup} from "../model/ModelEducationGroup";

export class ControllerUser {
    User: ModelUser = new ModelUser();
    Balance: ModelBalance = new ModelBalance();
    Group: ModelEducationGroup = new ModelEducationGroup();

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

    public async getDataUser(id: ITgUsername | IUuid): Promise<IAnswer<object>> {
        return await this.User.getDataUser(id);
    }

    public async getAllUsers(typeUser: any): Promise<IAnswer<User[]>> {
        return await this.User.getAllUsers(typeUser);
    }

    public async updateUser(data: IUser): Promise<IAnswer<string>> {
        return await this.User.updateUser(data);
    }

    public async deleteUser(id: ITgUsername | IUuid): Promise<IAnswer<string>> {
        try {
            let role = await this.User.getUserRole(id);
            if (role.message=== '3') {
                await this.Group.deleteChildren(id);
                await this.Balance.deleteBalance(id);
            }
            return await this.User.deleteUser(id);
        } catch {
            return {code: 500, message: 'Произошла ошибка'};
        }

    }

    public async getUserRole(id: ITgUsername | IUuid): Promise<IAnswer<string>> {
        return await this.User.getUserRole(id);
    }
}