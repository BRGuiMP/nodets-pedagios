import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config()

export const sequelizeAtua = new Sequelize(
    process.env.PG_DB as string,
    process.env.PG_USER as string,
    process.env.PG_PASSWORD as string,
    {
        host:process.env.PG_HOST as string,
        dialect: 'postgres',
        port: parseInt(process.env.PG_PORT as string),
        ssl: true,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
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