import { Admin } from "./Admin";
import { PersonalData } from "./PersonalData";

export function setupAssociations() {
    Admin.hasOne(PersonalData, {
        foreignKey: "uuidUser",
        sourceKey: "uuid",
    });

    PersonalData.belongsTo(Admin, {
        foreignKey: "uuidUser",
        targetKey: "uuid",
    });
}