import {Router} from "express";
import {Request, Response} from 'express';
import bodyParser from "body-parser";
import {ControllerTeacher} from "../controllers/ControllerTeacher";
import {SchemasCreate, SchemasRegister}  from "../middleware/validator/schemas/Schemas";

const router: Router = Router();
const controllerTeacher: ControllerTeacher = new ControllerTeacher();
const jsonParser = bodyParser.json();

router.post('/create',  jsonParser, async (req: Request, res: Response) => {
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
        let answer = await controllerTeacher.createTeacher(req.body);
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
        let answer = await controllerTeacher.registerTeacher(req.body);
        if (answer.code === 200) {
            res.status(200).send(answer);
        } else {
            res.status(400).send(answer);
        }
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
});
router.get('/:tgId', async (req: Request, res: Response) => {
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
});
router.get('/get/all', async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Учитель']
    */
    try {
        let allTeachers = await controllerTeacher.getAllTeacher();
        res.status(200).send({data: allTeachers});
    } catch (e: any) {
        res.status(500).send({data: JSON.parse(e.message)});
    }
});
router.put('/:tgUsername',  jsonParser, async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Учитель']
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
        let answer = await controllerTeacher.updateTeacher(data);
        if (answer.code === 200) {
            res.status(200).send(answer);
        } else {
            res.status(500).send(answer);
        }
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
})

export default router;