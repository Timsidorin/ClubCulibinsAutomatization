import {sequelize} from "../config/database/database";
import {Model, DataTypes} from "sequelize";

export class User extends Model {
    declare uuid: string;
    declare tgId: string;
    declare tgUsername: string;
    declare typeUser: {
        name: string,
        code: number
    };
    declare name: string;
    declare surname: string;
    declare lastName: string;
}

User.init(
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
        },
        typeUser: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        }
    },
    {
        sequelize,
        timestamps: false,
    }
);