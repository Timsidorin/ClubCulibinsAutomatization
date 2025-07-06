import {Teacher} from "../schemas/Teacher";

export interface ITeacher {
    tgId: string;
    tgUsername: string;
    name: string;
    secondName: string;
    lastName: string;
}

export interface IAnswerTeacher {
    code: number;
    message: string;
}

export interface IGetAnswerTeacher {
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

export interface IGetAllTeacher {
    data: Teacher[];
    code: number
}