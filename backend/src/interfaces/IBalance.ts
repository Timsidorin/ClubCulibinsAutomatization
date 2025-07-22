export interface IBalanceLog {
    uuidUser: string,
    operation: boolean,
    summ: number,
    tgTeacher: string,
}

export interface IFilterLogs {
    tgTeacher: string | undefined;
    uuidChild: string | undefined;
    operation: string | undefined;
    money: number | undefined;
    equalSign: number | undefined;
    createdAt: string | undefined;
    endDate: string | undefined;
}