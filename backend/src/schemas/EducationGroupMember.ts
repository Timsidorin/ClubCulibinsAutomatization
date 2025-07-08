import {sequelize} from "../config/database/database";
import {Model, DataTypes} from "sequelize";

export class EducationGroupMember extends Model {}

EducationGroupMember.init({
    tgUsername: {
        type: DataTypes.STRING,
    },
    uuidGroup: {
        type: DataTypes.UUID,
    },
},
{
    sequelize,
    timestamps: false,
});