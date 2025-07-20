//Инструменты из express
import {Request, Response, Router} from "express";
import bodyParser from "body-parser";
//Типизация
import {IAnswer} from "../interfaces/IAnswer";
//Схемы для валидации
import {SchemasUpdateBalance} from "../middleware/validator/schemas/SchemasBalance";
import {SchemasTgUsername} from "../middleware/validator/schemas/SchemasUniversal";
import {SchemasLogsBalance} from "../middleware/validator/schemas/SchemasBalance";
//Контроллеры
import {ControllerBalance} from "../controllers/ControllerBalance";

const router: Router = Router();
const controllerBalance: ControllerBalance = new ControllerBalance();
const jsonParser = bodyParser.json();

router.patch("/update", jsonParser, async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Баланс']
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Обновление баланса',
        schema: {
            tgUsername: '@string',
            tgTeacher: '@string',
            operation: true,
            summ: 0,
        }
    }
    */
    try {
        SchemasUpdateBalance.parse(req.body);
        let answer: IAnswer<object> = await controllerBalance.updateBalance(req.body.tgUsername, req.body.operation, req.body.summ, req.body.tgTeacher);
        res.status(answer.code).send({message: answer});
    } catch (error: any) {
        res.status(500).send(JSON.parse(error));
    }
});
router.get("/get", async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Баланс']
    #swagger.parameters['tgUsername'] = {
        description: 'По кому делать фильтрацию'
    }
    */
    try {
        SchemasTgUsername.parse(req.query.tgUsername);
        let answer = await controllerBalance.getBalance(String(req.query.tgUsername));
        res.status(answer.code).send({message: answer.message});
    } catch (error: any) {
        res.status(500).send(JSON.parse(error));
    }
});
router.get("/logs", jsonParser, async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Баланс']
    #swagger.parameters['tgTeacher'] = {
        description: 'Получение логов по фильтрам'
    },
        #swagger.parameters['tgChild'] = {
        description: 'Получение логов по фильтрам'
    },
    #swagger.parameters['operation'] = {
        description: 'Получение логов по фильтрам'
    },
        #swagger.parameters['summ'] = {
        description: 'Получение логов по фильтрам'
    },
    #swagger.parameters['startDate'] = {
        description: 'Получение логов по фильтрам'
    },
        #swagger.parameters['equalSign'] = {
        description: '1 - равно 2 - операция меньше переданного числа 3 - операция больше переданного числа'
    },
            #swagger.parameters['endDate'] = {
        description: 'Получение логов по фильтрам'
    },
    */
    try {
        let filters = {
            tgTeacher: req.query?.tgTeacher?.toString(),
            tgChild: req.query?.tgChild?.toString(),
            operation: req.query?.operation?.toString(),
            money: Number(req.query.summ),
            equalSign: Number(req.query.equalSign),
            createdAt: req.query?.startDate?.toString(),
            endDate: req.query?.endDate?.toString(),
        };
        SchemasLogsBalance.parse(filters);
        let response = await controllerBalance.getLogs(filters);
        res.status(response.code).send({message: response.message});
    } catch (error: any) {
        res.status(500).send(JSON.parse(error));
    }
});

export default router;