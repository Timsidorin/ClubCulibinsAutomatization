//Инструменты из express
import {Request, Response, Router} from 'express';
import bodyParser from "body-parser";
//Контроллеры
import {ControllerUser} from "../controllers/ControllerUser";
//Схемы для валидации
import {SchemasCreate, SchemasRegister} from "../middleware/validator/schemas/SchemasUser";
//Промежуточное
import {checkTypeParametr} from "../middleware/checkTypeParametr";

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
router.get('/:id', async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Пользователь']
    */
    try {
        let id = checkTypeParametr(req.params.id);
        if (id) {
            let userData = await controllerUser.getDataUser(id);
            res.status(userData.code).send({data: userData});
        } else {
            res.status(500).send({message: 'Невалидные данные'});
        }

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
router.put('/:id', jsonParser, async (req: Request, res: Response) => {
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
        let id = checkTypeParametr(req.params.id);
        if (id) {
            let data = {...req.body, ...id};
            let answer = await controllerUser.updateUser(data);
            res.status(answer.code).send(answer);
        } else {
            res.status(500).send({message: 'Невалидные данные'});
        }
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
});
router.delete('/:id', async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Пользователь']
    */
    try {
        let id = checkTypeParametr(req.params.id);
        if (id) {
            let answer = await controllerUser.deleteUser(id);
            res.status(answer.code).send(answer);
        } else {
            res.status(500).send({message: 'Невалидные данные'});
        }
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
});
router.get('/get/role', async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Пользователь']
       #swagger.parameters['id'] = {
        description: 'Получить роль пользователя'
        }
    */
    try {
        let id = checkTypeParametr(String(req.query.id));
        if (id) {
            let answer = await controllerUser.getUserRole(id);
            res.status(answer.code).send(answer)
        } else {
            res.status(500).send({message: 'Невалидные данные'});
        }

    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
});

export default router;