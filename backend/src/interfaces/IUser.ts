import {User} from "../schemas/User";

export interface IUser {
    tgId: string;
    tgUsername: string;
    name: string;
    secondName: string;
    lastName: string;
    typeUser: number;
    phoneNumber: string;
    dateOfBirth: Date;
    note: string;
}

export interface IAnswerUser {
    code: number;
    message: string;
}

export interface IGetAnswerUser {
    data: {
        tgUsername: string;
        personalData: {
            name: string;
            secondName: string;
            lastName: string;
        };
    }
    code: number
}

export interface IGetAllUsers {
    data: User[];
    code: number
}