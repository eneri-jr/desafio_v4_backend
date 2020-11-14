import * as express from "express";
import * as bodyParser from "body-parser";


//Classe para operar a inicialização da Aplicação:
class App{
    public app: express.Application;
    public port: number;

    constructor(port) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
    }

    private initializeMiddlewares(){
        this.app.use(bodyParser.json());
    }

    public listen(){
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

export default App;