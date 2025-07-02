import express, {Express} from 'express';
import {useRouter} from "./routes";

const app: Express = express();
const port = 3000;

useRouter(app);

app.listen(port, () => {
    console.log(`Swagger UI: http://localhost:${port}/api-docs`);
})