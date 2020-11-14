import HttpException from "./httpException";

//Classe para criar o erro quando não localizar uma tools pela id:
class ToolsNotFoundException extends HttpException {
    constructor(id: string){
        super(404, `Tools com id: ${id}, não foi encontrada!`);
    }
}

export default ToolsNotFoundException;