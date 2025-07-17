export interface IBalanceLog {
    tgUsername: string,
    operation: boolean,
    summ: number,
    tgTeacher: string,
}

export interface IFilterLogs {
    tgTeacher: string | undefined;
    tgChild: string | undefined;
    operation: string | undefined;
    money: number | undefined;
    equalSign: number | undefined;
    createdAt: string | undefined;
    endDate: string | undefined;
}