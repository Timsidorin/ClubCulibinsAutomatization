import adminRouter from "./adminRouter";
import {Express} from "express";
import swaggerUi from "swagger-ui-express";
import swaggerFile from '../docs/swagger_output.json';

export function useRouter(app: Express): void {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
    app.use('/admin', adminRouter);
}