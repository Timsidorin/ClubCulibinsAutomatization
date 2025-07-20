//Инструменты из express
import {Request, Response, Router} from 'express';
import bodyParser from "body-parser";
//Контроллеры
import {ControllerUser} from "../controllers/ControllerUser";
//Схемы для валидации
import {SchemasCreate, SchemasRegister, SchemasUpdateUser} from "../middleware/validator/schemas/SchemasUser";
import {SchemasTgUsername} from "../middleware/validator/schemas/SchemasUniversal";

const router: Router = Router();
const controllerUser: ControllerUser = new ControllerUser();
const jsonParser = bodyParser.json();

router.post('/create', jsonParser, async (req: Request, res: Response) => {
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
            phoneNumber: 'string',
            dateOfBirth: '2000-01-01',
            note: 'string'
        }
    }
    */
    try {
        SchemasCreate.parse(req.body);
        let answer = await controllerUser.createUser(req.body);
        res.status(answer.code).send({message: answer.message});
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
        SchemasRegister.parse(req.body);
        let answer = await controllerUser.registerUser(req.body);
        res.status(answer.code).send({message: answer.message});
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
        SchemasTgUsername.parse(req.params.tgUsername);
        let userData = await controllerUser.getDataUser(req.params.tgUsername);
        res.status(userData.code).send({data: userData});
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
router.put('/:tgUsername', jsonParser, async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Пользователь']
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Обновление данных',
        schema: {
            name: 'string',
            lastName: 'string',
            secondName: 'string',
            phoneNumber: 'string',
            dateOfBirth: '2000-01-01',
            note: 'string'
        }
    }
    */
    try {
        let data = {...req.body, tgUsername: req.params.tgUsername};
        SchemasUpdateUser.parse(data);
        let answer = await controllerUser.updateUser(data);
        res.status(answer.code).send(answer);
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
});
router.delete('/:tgUsername', async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Пользователь']
    */
    try {
        let answer = await controllerUser.deleteUser(req.params.tgUsername);
        SchemasTgUsername.parse(req.params.tgUsername);
        res.status(answer.code).send(answer);
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
});
router.get('/get/role', async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Пользователь']
       #swagger.parameters['tgUsername'] = {
        description: 'Получить роль пользователя'
        }
    */
    try {
        let paramsType = req.query.tgUsername;
        let answer = await controllerUser.getUserRole(paramsType);
        res.status(answer.code).send(answer)
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
});

export default router;