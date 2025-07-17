import {DataTypes, Model} from "sequelize";
import {sequelize} from "../config/database/database";

export class BountyLog extends Model {}

BountyLog.init(
    {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        uuidTeacher: {
            type: DataTypes.UUID,
        },
        uuidChild: {
            type: DataTypes.UUID,
        },
        operation: {
            type: DataTypes.STRING,
        },
        money: {
            type: DataTypes.INTEGER,
        },
        createdAt: {
            type: DataTypes.DATE,
        }
    },
    {
        sequelize,
        timestamps: false,
    }
);