import {Router} from "express";
import {Request, Response} from 'express';
import bodyParser from "body-parser";
import {ControllerUser} from "../controllers/ControllerUser";
import {SchemasCreate, SchemasRegister}  from "../middleware/validator/schemas/Schemas";

const router: Router = Router();
const controllerUser: ControllerUser = new ControllerUser();
const jsonParser = bodyParser.json();

router.post('/create',  jsonParser, async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Пользователь']
    #swagger.parameters['body'] = {
        in: 'body',
        description: '
        typeUser: 1 - Учитель
                  2 - Админ
                  3 - Ребенок
        ',
        schema: {
            tgUsername: '@string',
            name: 'string',
            lastName: 'string',
            secondName: 'string',
            typeUser: 1,
        }
    }
    */
    try {
        const validate = SchemasCreate.parse(req.body);
        let answer = await controllerUser.createUser(req.body);
        if (answer.code === 201) {
            res.status(201).send(answer);
        } else {
            res.status(400).send(answer);
        }
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
});
router.patch('/register', jsonParser, async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Пользователь']
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
        let answer = await controllerUser.registerUser(req.body);
        if (answer.code === 200) {
            res.status(200).send(answer);
        } else {
            res.status(400).send(answer);
        }
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
});
router.get('/:tgUsername', async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Пользователь']
    #swagger.parameters['tgUsername'] = {
        description: 'tg Username'
        }
    */
    try {
        let userData = await controllerUser.getDataUser(req.params.tgUsername);
        res.status(200).send({data: userData});
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
});
router.get('/get/all', async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Пользователь']
       #swagger.parameters['type'] = {
        description: 'Какую группу пользователей нужно получить'
        }
    */
    try {
        let paramsType = req.query.type;
        let allUsers = await controllerUser.getAllUsers(paramsType);
        res.status(200).send({data: allUsers});
    } catch (e: any) {
        res.status(500).send({data: JSON.parse(e.message)});
    }
});
router.put('/:tgUsername',  jsonParser, async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Пользователь']
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Обновление данных',
        schema: {
            name: 'string',
            lastName: 'string',
            secondName: 'string',
        }
    }
*/
    try {
        let data = {...req.body, tgUsername: req.params.tgUsername};
        let answer = await controllerUser.updateUser(data);
        if (answer.code === 200) {
            res.status(200).send(answer);
        } else {
            res.status(500).send(answer);
        }
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
})
router.delete('/:tgUsername', async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Пользователь']
    */
    try {
        let answer = await controllerUser.deleteUser(req.params.tgUsername);
        if (answer.code === 200) {
            res.status(200).send(answer);
        } else {
            res.status(500).send({message: answer});
        }
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
})

export default router;