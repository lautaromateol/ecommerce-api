import { config as dotenvConfig } from "dotenv"
import { registerAs } from "@nestjs/config"
import { DataSource, DataSourceOptions } from "typeorm"

const env = process.env.NODE_ENV || "development"
dotenvConfig({ path: `.env.${env}` })

const config = {
  type: "postgres",
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  autoLoadEntities: true,
  synchronize: env === "development",
  logging: false,
  entities: ["dist/**/*.entity{.ts,.js}"],
  migrations: ["dist/migrations/*{.ts,.js}"]
}

export default registerAs("typeorm", () => config)

export const connectionSource = new DataSource(config as DataSourceOptions)

