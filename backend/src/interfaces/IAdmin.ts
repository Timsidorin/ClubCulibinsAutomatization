export interface IAdmin {
    tgUsername: string;
    name: string;
    secondName: string;
    lastName: string;
}

export interface IAnswerAdminResponse {
    code: number;
    message: string;
}

export interface IRegisterAdmin {
    tgUsername: string;
    tgId: string;
}