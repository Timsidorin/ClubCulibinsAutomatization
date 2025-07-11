//Схемы таблиц
import { PersonalData } from "./PersonalData";
import { User } from "./User";
import {EducationGroup} from "./EducationGroup";
import {EducationGroupMember} from "./EducationGroupMember";
import {Balance} from "./Balance";

export function setupAssociations() {
    // User <-> PersonalData (1:1)
    User.hasOne(PersonalData, { foreignKey: "uuidUser", sourceKey: "uuid" });
    PersonalData.belongsTo(User, { foreignKey: "uuidUser", targetKey: "uuid" });

    // User <-> EducationGroup (1:N)
    User.hasMany(EducationGroup, { foreignKey: "uuidUser", sourceKey: "uuid" });
    EducationGroup.belongsTo(User, { foreignKey: "uuidUser", targetKey: "uuid" });

    //User <-> EducationGroupMember (1:N)
    User.hasMany(EducationGroupMember, { foreignKey: "tgUsername", sourceKey: "tgUsername" });
    EducationGroupMember.belongsTo(User, { foreignKey: "tgUsername", targetKey: "tgUsername" });

    //EducationGroup <-> EducationGroupMember (1:N)
    EducationGroup.hasMany(EducationGroupMember, { foreignKey: "uuidGroup", sourceKey: "uuid" });
    EducationGroupMember.belongsTo(EducationGroup, { foreignKey: "uuidGroup", targetKey: "uuid" });

    //User <-> Balance (1:1)
    User.hasOne(Balance, { foreignKey: "uuidUser", sourceKey: "uuid" });
    Balance.belongsTo(User, { foreignKey: "uuidUser", targetKey: "uuid" });
}