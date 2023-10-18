import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../clients/db";

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
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true
        }  
    },
    {
       sequelize: sequelizeConnection,
       modelName: "Users",
       tableName: "users" 
    }
);