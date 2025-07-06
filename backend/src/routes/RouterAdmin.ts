import {Router} from "express";
import {Request, Response} from 'express';
import {ControllerAdmin} from "../controllers/ControllerAdmin";
import bodyParser from "body-parser";
import {SchemasCreate, SchemasRegister}  from "../middleware/validator/schemas/Schemas";

const router: Router = Router();
const controllerAdmin: ControllerAdmin = new ControllerAdmin();
const jsonParser = bodyParser.json();
router.post('/create', jsonParser, async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Админка']
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Создание юзера',
        schema: {
            tgUsername: '@string',
            name: 'string',
            lastName: 'string',
            secondName: 'string',
        }
    }
    */
    try {
        const validate = SchemasCreate.parse(req.body);
        const result = await controllerAdmin.createAdmin(req.body);
        if (result.code === 200) {
            res.status(201).send({ message: 'Успешное создание админа' });
        } else {
            res.status(500).send({ message: result.message, status: result.code });
        }
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
});
router.patch('/register', jsonParser, async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Админка']
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Вставка tg Id',
        schema: {
            tgUsername: '@string',
            tgId: 0
        }
    }
    */
    try {
        const validate = SchemasRegister.parse(req.body);
        let result = await controllerAdmin.registerAdmin(req.body);
        if (result.code === 200) {
            res.status(201).send({ message: 'Успешное создание админа' });
        } else {
            res.status(500).send({ message: result.message, status: result.code });
        }
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
})
router.get('/:tgId', async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Админка']
    #swagger.parameters['tgId'] = {
        description: 'Id telegram'
        }
    */
    try {
        let answer = await controllerAdmin.getAdminData(req.params["tgId"]);
        res.status(200).send(answer);
    } catch (e: any) {
        res.status(500).send({message: e.message});
    }
})

export default router;