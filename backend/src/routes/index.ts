import RouterAdmin from "./RouterAdmin";
import RouterTeacher from "./RouterTeacher";
import {Express} from "express";
import swaggerUi from "swagger-ui-express";
import swaggerFile from '../docs/swagger_output.json';

export function useRouter(app: Express): void {
    //Сваггер
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
    //Админка
    app.use('/admin', RouterAdmin);
    //Учитель
    app.use('/teacher', RouterTeacher);
}