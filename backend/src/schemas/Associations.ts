import { PersonalData } from "./PersonalData";
import { Teacher } from "./Teacher";

export function setupAssociations() {
    Teacher.hasOne(PersonalData, {
        foreignKey: "uuidUser",
        sourceKey: "uuid",
    });

    PersonalData.belongsTo(Teacher, {
        foreignKey: "uuidUser",
        targetKey: "uuid",
    });
}