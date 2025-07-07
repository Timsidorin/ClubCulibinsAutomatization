import { PersonalData } from "./PersonalData";
import { User } from "./User";
import {EducationGroup} from "./EducationGroup";

export function setupAssociations() {
    // User <-> PersonalData (1:1)
    User.hasOne(PersonalData, { foreignKey: "uuidUser", sourceKey: "uuid" });
    PersonalData.belongsTo(User, { foreignKey: "uuidUser", targetKey: "uuid" });

    // User <-> EducationGroup (1:N)
    User.hasMany(EducationGroup, { foreignKey: "uuidUser", sourceKey: "uuid" });
    EducationGroup.belongsTo(User, { foreignKey: "uuidUser", targetKey: "uuid" });
}