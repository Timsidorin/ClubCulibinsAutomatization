export interface IEducationGroupCreate {
    name: string,
    description: string,
    tgUsername: string,
    uuidUser: string,
    uuid: string,
    createdAt: Date,
    updatedAt: Date,
    urlName: string,
}

export interface IAddChildren<T> {
    uuidGroup: string;
    childrens: T[];
}