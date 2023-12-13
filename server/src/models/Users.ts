import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../clients/db/database";

export class User extends Model {};

User.init(
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        extra: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            // defaultValue: DataTypes.NOW,
            allowNull: true
        },
    },
    {
       sequelize: sequelizeConnection,
       modelName: "Users",
       tableName: "users" 
    }
);