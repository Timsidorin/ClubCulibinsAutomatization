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
    uuid: string;
}

export interface IUuid {
    uuid: string;
}

export interface ITgUsername {
    tgUsername: string;
}