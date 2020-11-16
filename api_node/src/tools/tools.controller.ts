import * as express from "express";
import { getRepository} from "typeorm";
import ToolsNotFoundException from "../exceptions/toolsNotFoundException";
import Controller from "../interfaces/controller.interface";
import Tools from "./tools.entity";
import Tags from "../tag/tags.entity";

//Classe que irá fazer todo controle entre a entidade e o banco de dados:
class ToolsController implements Controller {

    public path = "/tools";
    public router = express.Router();

    //Inicializaçao do repositório de tools:
    private toolsRepository = getRepository(Tools);

    //Inicialização do repositório de tag:
    private tagRepository = getRepository(Tags);

    //Construtor da classe:
    constructor(){
        this.initializeRoutes();
    }

    //Declaração de rotas que irão fazer modificações no banco:
    private initializeRoutes(){
        this.router.get(this.path, this.getAllTools);
        //A rota por tag será feita após a criação da entidade TAG
        this.router.post(this.path, this.createTools);
        this.router.delete(`${this.path}/:id`, this.deleteTools)
    }

    //função para listar todas as tools cadastradas:
    private getAllTools = async (request: express.Request, response: express.Response) => {
        const tools = await this.toolsRepository.find();
        response.send(tools);
    }
    
    //função para criar uma tools com tags:
    private createTools = async (request: express.Request, response: express.Response) => {
        const listTags = [];
        const listTagsUnique = [...new Set(request.body.tags)]

        //Transformar lista de tags strings em lista de objetos tags
        for(const tag of listTagsUnique){
            const newTag = new Tags();
            newTag.description = tag.toString();
            const findTag = await this.tagRepository.findOne(newTag);
            
            if(findTag === undefined){
                listTags.push(newTag)
            } else{
            listTags.push(findTag);
            }
        }

        const newTool = new Tools();

        newTool.description = request.body.description;
        newTool.link = request.body.link;
        newTool.title = request.body.title;
        newTool.tags = listTags;

        const tool = this.toolsRepository.create(newTool);
        await this.toolsRepository.save(tool);
        response.send(tool);
    }

    //função para deletar uma tools:
    private deleteTools = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const deleteResponse = await this.toolsRepository.delete(id);
        
        //Tratamento de erro se não achar tools para exclusão:
        if(deleteResponse.affected == 1) {
            response.sendStatus(204);
        }else {
            next(new ToolsNotFoundException(id));
        }
    }
}

export default ToolsController;