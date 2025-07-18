import { Faker, ru } from '@faker-js/faker';
import {User} from "../../../schemas/User";
import {PersonalData} from "../../../schemas/PersonalData";

async function createUsers() {

    const faker = new Faker({
        locale: [ru],
    });

    let [teacher, personalDataTeacher] = createStructure(1, 'teacher', faker);
    let [child, personalDataChild] = createStructure(3, 'children', faker);

    await User.bulkCreate([...teacher, ...child]);
    await PersonalData.bulkCreate([...personalDataTeacher, ...personalDataChild])
}

function createStructure(typeUser: number, name: string, faker: Faker) {
    let users = [];
    let personalData = [];
    for (let i = 0; i < 50; i++) {
        let uuid = faker.string.uuid();
        let newUser =  {tgId: `@${i+Math.random()}`, typeUser: typeUser, uuid: uuid, tgUsername: `@${name}${i}`};
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