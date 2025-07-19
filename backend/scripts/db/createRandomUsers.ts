import { Faker, ru } from '@faker-js/faker';
import {User} from "../../src/schemas/User";
import {PersonalData} from "../../src/schemas/PersonalData";
import {Balance} from "../../src/schemas/Balance";

async function createUsers() {

    const faker = new Faker({
        locale: [ru],
    });

    let [teacher, personalDataTeacher] = createStructure(1, 'teacher', faker);
    let [child, personalDataChild] = createStructure(3, 'children', faker);
    let uuidChilds = child.map(child => {
        return {uuidUser: child?.uuid, money: 0};
    });
    await Promise.all(
        [
            User.bulkCreate([...teacher, ...child]),
            PersonalData.bulkCreate([...personalDataTeacher, ...personalDataChild]),
            Balance.bulkCreate([...uuidChilds]),
        ]);
}

function createStructure(
    typeUser: number,
    name: string,
    faker: Faker
): [
    Array<{
        uuid: string;
        tgId: string;
        typeUser: number;
        tgUsername: string;
    }>,
    Array<{
        uuidUser: string;
        name: string;
        secondName: string;
        lastName: string;
        phoneNumber: string;
        dateOfBirth: Date;
    }>
] {
    let users: Array<{
        uuid: string;
        tgId: string;
        typeUser: number;
        tgUsername: string;
    }> = [];

    let personalData: Array<{
        uuidUser: string;
        name: string;
        secondName: string;
        lastName: string;
        phoneNumber: string;
        dateOfBirth: Date;
    }> = [];

    for (let i = 0; i < 50; i++) {
        let uuid = faker.string.uuid();
        let newUser = {
            tgId: `@${i + Math.random()}`,
            typeUser: typeUser,
            uuid: uuid,
            tgUsername: `@${name}${i}`,
        };

        let newPersonalData = {
            uuidUser: uuid,
            name: faker.person.firstName(),
            secondName: faker.person.middleName(),
            lastName: faker.person.lastName(),
            phoneNumber: faker.phone.number(),
            dateOfBirth: faker.date.past(),
        };

        users.push(newUser);
        personalData.push(newPersonalData);
    }

    return [users, personalData];
}

createUsers();