import { Column, Entity, PrimaryGeneratedColumn, ManyToMany} from "typeorm";
import Tools from "../tools/tools.entity";

//Criação da entidade Tag:
@Entity()
class Tags{
    @PrimaryGeneratedColumn()
    public id?: number;

    @Column()
    public description: string;

    @ManyToMany(type => Tools, tags => Tags)
    public tools: Tools;
}

export default Tags;