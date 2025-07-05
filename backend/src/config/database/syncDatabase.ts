import { sequelize } from './database';
import '../../schemas/Admin';
import '../../schemas/PersonalData';

async function syncDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Подключение к БД успешно.');

        await sequelize.sync({ force: true });
        console.log('Все модели синхронизированы.');
    } catch (error) {
        console.error('Ошибка синхронизации:', error);
    } finally {
        await sequelize.close();
    }
}

syncDatabase();