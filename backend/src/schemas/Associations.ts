import { Admin } from "./Admin";
import { PersonalData } from "./PersonalData";
import { Teacher } from "./Teacher";

export function setupAssociations() {
    //Связываем админа и персоналку
    Admin.hasOne(PersonalData, {
        foreignKey: "uuidUser",
        sourceKey: "uuid",
    });

    PersonalData.belongsTo(Admin, {
        foreignKey: "uuidUser",
        targetKey: "uuid",
    });

    //Связываем учителя и персоналку
    PersonalData.belongsTo(Teacher, {
        foreignKey: "uuidUser",
        targetKey: "uuid",
    });

    Teacher.hasOne(PersonalData, {
        foreignKey: "uuidUser",
        sourceKey: "uuid",
    });
}