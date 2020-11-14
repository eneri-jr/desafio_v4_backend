import "reflect-metadata";
import {createConnection} from "typeorm";
import App from "./app";
import config from "./ormconfig";

//Função que irá realizar a conexão com o banco de dados e a chamada da aplicação:
(async () => {
    try{
        await createConnection(config);
    } catch(error) {
        console.log("Error while connecting to the database", error);
        return error;
    }

    const app = new App(3000);

    app.listen();
})();