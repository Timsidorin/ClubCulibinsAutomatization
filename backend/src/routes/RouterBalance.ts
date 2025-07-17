import {Request, Response, Router} from "express";
import {ControllerBalance} from "../controllers/ControllerBalance";
import bodyParser from "body-parser";
import {IAnswer} from "../interfaces/IAnswer";

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
        let answer: IAnswer<object> = await controllerBalance.updateBalance(req.body.tgUsername, req.body.operation, req.body.summ, req.body.tgTeacher);
        res.status(answer.code).send(answer);
    } catch (error: any) {
        res.status(500).send({error: error.message});
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
        let answer = await controllerBalance.getBalance(req.query.tgUsername);
        res.status(200).send(answer);
    } catch (error: any) {
        res.status(500).send(error);
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
            money: Number(req.query?.summ),
            equalSign: Number(req.query?.equalSign),
            createdAt: req.query?.startDate?.toString(),
            endDate: req.query?.endDate?.toString(),
        };
        let response = await controllerBalance.getLogs(filters);
        res.status(response.code).send(response.message);
    } catch (error: any) {
        res.status(500).send(error);
    }
});

export default router;