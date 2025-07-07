import {Request, Response, Router} from "express";
import {ControllerTeacher} from "../controllers/ControllerTeacher";
import bodyParser from "body-parser";


const router: Router = Router();
const controllerTeacher: ControllerTeacher = new ControllerTeacher();
const jsonParser = bodyParser.json();

