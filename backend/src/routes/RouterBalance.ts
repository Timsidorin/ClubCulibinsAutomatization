import {Request, Response, Router} from "express";
import {ControllerBalance} from "../controllers/ControllerBalance";
import bodyParser from "body-parser";

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
            operation: true,
            summ: 0,
        }
    }
    */
    try {
        let answer = await controllerBalance.updateBalance(req.body.tgUsername, req.body.operation, req.body.summ);
        res.status(200).send(answer);
    } catch (error: any) {
        res.status(500).send({error: error.message});
    }
})
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
})

export default router;