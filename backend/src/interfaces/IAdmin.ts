export interface IAdmin {
    tgUsername: string;
    name: string;
    secondName: string;
    lastName: string;
}

export interface ICreateAdminResponse {
    code: number;
    message: string;
}

export interface IRegisterAdmin {
    tgUsername: string;
    tgId: string;
}

export interface IRegisterAdminResponse {
    code: number;
    message: string;
}