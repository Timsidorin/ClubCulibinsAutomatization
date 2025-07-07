import {sequelize} from "../config/database/database";
import {Model, DataTypes} from "sequelize";

export class TypeUser extends Model {}

TypeUser.init(
    {
        type: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
        }
    },
    {
        sequelize,
        timestamps: false,
    })