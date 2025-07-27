//Инструменты из express
import {Request, Response, Router} from "express";
import bodyParser from "body-parser";
//Контроллеры
import {ControllerEducationGroup} from "../controllers/ControllerEducationGroup";
//Схемы для валидации
import {SchemasCreateEducationGroup, SchemasAddChildrens} from "../middleware/validator/schemas/SchemasEducationGroup";
import {SchemasUuidAndTgName, SchemasUuid} from "../middleware/validator/schemas/SchemasUniversal";

const router: Router = Router();
const controllerEducationGroup: ControllerEducationGroup = new ControllerEducationGroup();
const jsonParser = bodyParser.json();

router.post("/create", jsonParser, async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Учебная группа']
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Создание учебной группы',
        schema: {
            tgUsername: '@string',
            name: 'string',
            description: 'string',
            urlName: 'string'
        }
    }
    */
    try {
        SchemasCreateEducationGroup.parse(req.body);
        let response = await controllerEducationGroup.createGroup(req.body);
        res.status(response.code).send({message: response.message});
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e)});
    }
});
router.get("/get-all", async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Учебная группа']
    #swagger.parameters['tgUsername'] = {
        in: 'query',
        description: 'Фильтрация по Telegram username (можно передать несколько значений)',
        type: 'array',
        collectionFormat: 'multi',
        items: { type: 'string' },
        required: false
    }
    */
    try {
        let tgUsernames = req.query.tgUsername;

        // Если передано одно значение — преобразуем в массив
        if (tgUsernames && !Array.isArray(tgUsernames)) {
            tgUsernames = [tgUsernames];
        }

        // Если передана строка с разделителями (например, "user1,user2")
        if (typeof tgUsernames === 'string') {
            tgUsernames = tgUsernames.split(',');
        }

        let response = await controllerEducationGroup.getAllEducationGroups(tgUsernames);
        res.status(200).send({message: response?.message});
    } catch (e: any) {
        res.status(500).send({message: e.message});
    }
});
router.post("/add-childrens", jsonParser, async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Учебная группа']
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Создание учебной группы',
        schema: {
            uuidGroup: 'uuid',
            childrens: ['uuid'],
        }
    }
    */
    try {
        SchemasAddChildrens.parse(req.body);
        let answer = await controllerEducationGroup.addChildrens(req.body);
        res.status(answer.code).send({message: answer.message});
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
});
router.delete('/:uuid', jsonParser, async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Учебная группа']
    */
    try {
        let uuid = req.params.uuid;
        SchemasUuid.parse(uuid);
        let response = await controllerEducationGroup.deleteEducationGroup(uuid);
        res.status(response.code).send({message: response.message});
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
});
router.delete('/children/:uuidUser/:uuidGroup', async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Учебная группа']
    */
    try {
        let uuidUser = req.params.uuidUser;
        let uuidGroup = req.params.uuidGroup;
        SchemasUuid.parse(uuidUser);
        SchemasUuid.parse(uuidGroup);
        if (uuidUser) {
            let response = await controllerEducationGroup.deleteChildren(uuidUser, uuidGroup);
            res.status(response.code).send({message: response.message});
        } else {
            res.status(500).send({message: 'Произошла ошибка'});
        }
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
});
router.post('/add-teacher', jsonParser, async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Учебная группа']
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Назначение препода к группе',
        schema: {
            tgUsername: '@string',
            uuid: 'string',
        }
    }
    */
    try {
        SchemasUuidAndTgName.parse(req.body);
        let answer = await controllerEducationGroup.connectWithGroup(req.body.tgUsername, req.body.uuid);
        res.status(answer.code).send({message: answer.message});
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
});
router.put('/update-group', jsonParser, async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Учебная группа']
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Обновление группы',
        schema: {
            uuid: 'string',
            name: 'string',
            description: 'string',
            urlName: 'string',
        }
    }
    */
    try {
        let answer = await controllerEducationGroup.updateInfoGroup(req.body);
        res.status(answer.code).send({message: answer.message});
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
});
router.get('/get/composition/:uuid', async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Учебная группа']
    */
    try {
        SchemasUuid.parse(req.params.uuid);
        let answer = await controllerEducationGroup.getGroupComposition(req.params.uuid);
        res.status(answer.code).send({message: answer.message});
    } catch (e: any) {
        res.status(500).send(JSON.parse(e));
    }
});

export default router;