//Экземпляр БД
import {sequelize} from './database';
//Схемы таблиц
import '../../schemas/PersonalData';
import '../../schemas/User';
import '../../schemas/TypeUser';
import '../../schemas/EducationGroup'
import '../../schemas/EducationGroupMember'
import '../../schemas/Balance';
import '../../schemas/BountyLog';
//Утилиты для работы с БД
import {createTypesUser} from "./create/createTypesUser";

async function syncDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Подключение к БД успешно.');
        await sequelize.sync({force: true});
        console.log('Все модели синхронизированы.');
        await createTypesUser();
    } catch (error) {
        console.error('Ошибка синхронизации:', error);
    } finally {
        await sequelize.close();
    }
}

syncDatabase();