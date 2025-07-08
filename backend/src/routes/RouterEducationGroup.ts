import {Request, Response, Router} from "express";
import {ControllerEducationGroup} from "../controllers/ControllerEducationGroup";
import bodyParser from "body-parser";

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
            description: 'string'
        }
    }
    */
    try {
        await controllerEducationGroup.createGroup(req.body);
        res.status(201).send({message: 'Группа создана'});
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
})
router.get("/get-all", async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Учебная группа']
       #swagger.parameters['tgUsername'] = {
        description: 'По кому делать фильтрацию'
        }
    */
    try {
        let response = await controllerEducationGroup.getAllEducationGroups(req.query.tgUsername);
        res.status(200).send(response);
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
})
router.post("/add-childrens", jsonParser, async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Учебная группа']
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Создание учебной группы',
        schema: {
            uuidGroup: 'uuid',
            childrens: ['tgUsername'],
        }
    }
    */
    try {
        await controllerEducationGroup.addChildrens(req.body);
        res.status(200).send({message: 'Успешное наполнение группы'});
    } catch (e: any) {
        res.status(500).send({message: JSON.parse(e.message)});
    }
})

export default router;