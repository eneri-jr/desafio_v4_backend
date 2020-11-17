import HttpException from "./httpException";

//Classe para criar o erro quando não localizar uma tools pela id:
class TagNotFoundException extends HttpException {
    constructor(){
        super(404, `A tag solicitada não foi encontrada!`);
    }
}

export default TagNotFoundException;