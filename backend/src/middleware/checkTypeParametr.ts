import {ITgUsername, IUuid} from "../interfaces/IUser";

//У нас логика была завязана на tgUsername (считали что они обязательны у всех, но это неправильно),
// конечно лучше бы стоило изначально завязываться на uuid, но уже так
export function checkTypeParametr(parametr: string): ITgUsername | IUuid | null {
    const uuidRegex = /([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
    const uuidMatch = parametr.match(uuidRegex);

    if (uuidMatch) {
        return { uuid: uuidMatch[1] };
    }

    if (parametr.startsWith('@')) {
        return { tgUsername: parametr };
    }

    return null;
}