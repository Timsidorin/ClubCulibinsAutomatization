import {sequelize} from "../config/database/database";
import {Model, DataTypes} from "sequelize";

export class EducationGroupMember extends Model {
    declare uuidUser: string;
    declare uuidGroup: string;
}

EducationGroupMember.init({
    uuidUser: {
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