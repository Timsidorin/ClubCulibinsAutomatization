import {TypeUser} from "../../../schemas/TypeUser";

export async function createTypesUser(): Promise<boolean> {
    try {
        await TypeUser.create({
            type: 1,
            name: 'Учитель',
        })
        await TypeUser.create({
            type: 2,
            name: 'Админ',
        })
        await TypeUser.create({
            type: 3,
            name: 'Ребенок',
        })
        console.log('Типы пользователей созданы!')
        return true;
    } catch {
        throw new Error('Произошла ошибка!');
    }
}