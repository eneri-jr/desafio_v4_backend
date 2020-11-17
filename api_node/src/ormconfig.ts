import { ConnectionOptions } from "typeorm";

//Configuração para acesso ao banco de dados por typeorm:
const config: ConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: 'admin',
    database: 'db_v4',
    entities: [
        "dist/**/*.entity{.ts,.js}",
        "src/**/*.entity{.ts,.js}"
    ],
    synchronize: true
}

export default config;