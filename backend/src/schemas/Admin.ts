import {sequelize} from "../config/database/database";
import {Model, DataTypes} from "sequelize";

export class Admin extends Model {
    declare uuid: string;
    declare tgId: string;
    declare tgUsername: string;
}

Admin.init({
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
    });