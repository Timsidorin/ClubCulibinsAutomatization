import express, { Express } from 'express';
import { useRouter } from "./routes";
import { sequelize } from "./config/database/database";
import { setupAssociations } from "./schemas/Associations";
import cors from 'cors';

async function startServer() {
    try {
        // Подключаемся к БД
        await sequelize.authenticate();
        setupAssociations();
        console.log('Подключились к БД');

        const app: Express = express();
        const port = 3000;

        app.use(cors({
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        // Подключаем роутер
        useRouter(app);

        app.listen(port, () => {
            console.log(`Swagger UI: http://localhost:${port}/api-docs`);
        });

    } catch (error) {
        console.error('Ошибка запуска:', error);
        process.exit(1);
    }
}

startServer();
