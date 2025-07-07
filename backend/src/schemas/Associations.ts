import { PersonalData } from "./PersonalData";
import { User } from "./User";

export function setupAssociations() {
    User.hasOne(PersonalData, {
        foreignKey: "uuidUser",
        sourceKey: "uuid",
    });

    PersonalData.belongsTo(User, {
        foreignKey: "uuidUser",
        targetKey: "uuid",
    });
}