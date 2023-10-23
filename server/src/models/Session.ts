import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../clients/db";
import { User } from "./Users";

export class Session extends Model {};

Session.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id"
            }
        },
        valid: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        sequelize: sequelizeConnection,
        modelName: "Session",
        timestamps: true,
    }
);

Session.belongsTo(User, { foreignKey: "userId" });
