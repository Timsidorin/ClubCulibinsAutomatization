//Роуты
import RouterUser from "./RouterUser";
import RouterEducationGroup from "./RouterEducationGroup";
import RouterBalance from "./RouterBalance";
//Типы
import {Express} from "express";
//Сваггер
import swaggerUi from "swagger-ui-express";
import swaggerFile from '../docs/swagger_output.json';

export function useRouter(app: Express): void {
    //Сваггер
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
    //Пользователь
    app.use('/user', RouterUser);
    //Учебная группа
    app.use('/education-group', RouterEducationGroup);
    //Баланс
    app.use('/balance', RouterBalance)
}