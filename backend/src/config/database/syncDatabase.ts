import { sequelize } from './database';
import '../../schemas/PersonalData';
import '../../schemas/User';
import '../../schemas/TypeUser';
import {createTypesUser} from "./create/createTypesUser";

async function syncDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Подключение к БД успешно.');

        await sequelize.sync({ force: true });
        console.log('Все модели синхронизированы.');
        await createTypesUser();
    } catch (error) {
        console.error('Ошибка синхронизации:', error);
    } finally {
        await sequelize.close();
    }
}

syncDatabase();