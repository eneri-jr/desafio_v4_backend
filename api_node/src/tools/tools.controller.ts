import * as express from "express";
import { getRepository, Index} from "typeorm";
import ToolsNotFoundException from "../exceptions/toolsNotFoundException";
import TagNotFoundException from "../exceptions/tagNotFoundException";
import Controller from "../interfaces/controller.interface";
import Tools from "./tools.entity";
import Tags from "../tags/tags.entity";

//Classe que irá fazer todo controle entre a entidade e o banco de dados:
class ToolsController implements Controller {

    public path = "/tools";
    public router = express.Router();

    //Inicializaçao do repositório de tools:
    private toolsRepository = getRepository(Tools);

    //Inicialização do repositório de tag:
    private tagsRepository = getRepository(Tags);

    //Construtor da classe:
    constructor(){
        this.initializeRoutes();
    }

    //Declaração de rotas que irão fazer modificações/pesquisas no banco:
    private initializeRoutes(){
        this.router.get(this.path, this.getTools);
        this.router.post(this.path, this.createTools);
        this.router.delete(`${this.path}/:id`, this.deleteTools)
    }

    //Metódo para testar se objeto tag esta vazio e validar qual ação fazer no get:
    private isEmpty(obj){
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    }

    //função para tratar requisição Get:
    private getTools = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const tag = request.query;

        //Realiza o teste se o Get sera feito por todos os elementos ou então somente por uma query string:
        if(this.isEmpty(tag)){
            const tools = await this.toolsRepository.find({relations: ['tags']});
            this.getToolsFinally(tools, response);
        } else {
            const tools = await this.toolsRepository
                                .createQueryBuilder("tools")
                                .innerJoinAndSelect("tools.tags", "tags")
                                .where("tags.description = :tag", tag)
                                .getMany();

            //Tratamento de erro se não for encontrada nenhuma tag com o que foi passado:
            if(tools.length == 0){
                next(new TagNotFoundException());
            }

            const listTools = [];

            for(const tool of tools){
                const newTool = await this.toolsRepository
                                .createQueryBuilder("tools")
                                .innerJoinAndSelect("tools.tags", "tags")
                                .where("tools.id = :id", {id: tool.id } )
                                .getOne();
                listTools.push(newTool)
            }

            this.getToolsFinally(listTools, response);
        }
    }

    //Função para transformar a lista de objetos tags em lista de strings e enviar a resposta
    private getToolsFinally(tools: Tools[], response){
        const listStringTags = [];

        for(const tool of tools){
            listStringTags.splice(0,listStringTags.length);
            
            for(const tag of tool.tags){
                listStringTags.push(tag.description);
            }
            
            tool.tags.splice(0, tool.tags.length)

            for(const tag of listStringTags){
               tool.tags.push(tag);
            }
        }

        response.send(tools);
    }
    
    //função para criar uma tools com tags:
    private createTools = async (request: express.Request, response: express.Response) => {
        const listTags = [];
        const listTagsUnique = [...new Set(request.body.tags)];
        const listTagsResp = [];

        //Transformar lista de tags strings em lista de objetos tags:
        for(const tag of listTagsUnique){
            const newTag = new Tags();
            newTag.description = tag.toString();
            const findTag = await this.tagsRepository.findOne(newTag);
            
            if(findTag === undefined){
                listTags.push(newTag);
            } else{
            listTags.push(findTag);
            }
        }

        //Cria uma tool com uma lista de tags(objeto):
        const newTool = new Tools();

        newTool.description = request.body.description;
        newTool.link = request.body.link;
        newTool.title = request.body.title;
        newTool.tags = listTags;

        //Salva no banco a tool, e usando o cascade ja salva também as tags:
        const tool = this.toolsRepository.create(newTool);
        await this.toolsRepository.save(tool);

        //Laço para criar uma lista de strings das tags novamente para usar na resposta.
        for(const tag of tool.tags){
            listTagsResp.push(tag.description);
        }
        tool.tags = listTagsResp;

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