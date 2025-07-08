import {DataTypes, Model} from "sequelize";
import {sequelize} from "../config/database/database";

export class EducationGroup extends Model {}

EducationGroup.init(
    {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        uuidUser: {
            type: DataTypes.UUID,
        },
        name: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
        }
    },
    {
        sequelize,
    });