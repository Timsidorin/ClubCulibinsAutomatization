import {DataTypes, Model} from "sequelize";
import {sequelize} from "../config/database/database";

export class Balance extends Model {}

Balance.init(
    {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        uuidUser: {
            type: DataTypes.UUID,
        },
        money: {
            type: DataTypes.INTEGER,
        }
    },
    {
        sequelize,
        timestamps: false,
    });