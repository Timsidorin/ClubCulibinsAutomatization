import { PersonalData } from "./PersonalData";
import { Teacher } from "./Teacher";

export function setupAssociations() {
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