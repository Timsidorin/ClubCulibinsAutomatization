import {Router} from "express";
import {Request, Response} from 'express';
import bodyParser from "body-parser";
import {ControllerTeacher} from "../controllers/ControllerTeacher";
import {SchemasCreate, SchemasRegister}  from "../middleware/validator/schemas/Schemas";

import cors from 'cors';

const router: Router = Router();
const controllerTeacher: ControllerTeacher = new ControllerTeacher();
const jsonParser = bodyParser.json();

let corsOptions = {
    origin: 'http://localhost:8002',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

router.post('/create', cors(corsOptions), jsonParser, async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Учитель']
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
        await controllerTeacher.createTeacher(req.body);
        res.status(201).send({message: "Учитель создан"});
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }

})
router.patch('/register', cors(corsOptions), jsonParser, async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Учитель']
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
        await controllerTeacher.registerTeacher(req.body);
        res.status(201).send({message: "Успешная регистрация"});
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
})
router.get('/:tgId', cors(corsOptions), async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Учитель']
    #swagger.parameters['tgId'] = {
        description: 'Id telegram'
        }
    */
    try {
        let teacherData = await controllerTeacher.getDataTeacher(req.params.tgId);
        res.status(200).send({data: teacherData});
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
})
router.get('/get/all', cors(corsOptions), async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Учитель']
    */
    try {
        let allTeachers = await controllerTeacher.getAllTeacher();
        res.status(200).send({data: allTeachers});
    } catch (e: any) {
        res.status(500).send({data: JSON.parse(e.message)});
    }
})

export default router;