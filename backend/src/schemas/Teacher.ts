import {sequelize} from "../config/database/database";
import {Model, DataTypes} from "sequelize";

export class Teacher extends Model {
    declare uuid: string;
    declare tgId: string;
    declare tgUsername: string;
}

Teacher.init(
    {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        },
        tgId: {
            type: DataTypes.STRING,
            unique: true
        },
        tgUsername: {
            type: DataTypes.STRING,
            unique: true,
        }
    },
    {
        sequelize,
    }
);