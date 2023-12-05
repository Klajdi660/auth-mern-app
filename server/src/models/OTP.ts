import { DataTypes, Model, literal, Sequelize } from "sequelize";
import { sequelizeConnection } from "../clients/db/database";

export class OTP extends Model {};

OTP.init(
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: literal("CURRENT_TIMESTAMP + INTERVAL 60 SECOND"),
        },
    },
    {
        sequelize: sequelizeConnection,
        modelName: "usersCode",
        tableName: "usersCode"
    }
);