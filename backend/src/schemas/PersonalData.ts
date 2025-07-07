import {sequelize} from "../config/database/database";
import {Model, DataTypes} from "sequelize";

export class PersonalData extends Model {}

PersonalData.init({
        uuidUser: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
        },
        secondName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
    })