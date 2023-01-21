import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config()

export const sequelizeAtua = new Sequelize(
    process.env.MYSQLATUA_DB as string,
    process.env.MYSQLATUA_USER as string,
    process.env.MYSQLATUA_PASSWORD as string,
    {
        dialect: 'mysql',
        port: parseInt(process.env.MYSQLATUA_PORT as string)
    }
)

export const sequelizePedagio = new Sequelize(
    process.env.MYSQLPEDAGIO_DB as string,
    process.env.MYSQLPEDAGIO_USER as string,
    process.env.MYSQLPEDAGIO_PASSWORD as string,
    {
        dialect: 'mysql',
        port: parseInt(process.env.MYSQLPEDAGIO_PORT as string)
    }
)