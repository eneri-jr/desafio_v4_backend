import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import Tags from "../tag/tags.entity"

//Criação da entidade Tools:
@Entity()
class Tools{
    @PrimaryGeneratedColumn()
    public id?: number;

    @Column()
    public title: string;

    @Column()
    public link: string;

    @Column()
    public description: string;

    @ManyToMany(type => Tags, tools => Tools, {
        cascade: ["insert", "update"]
    })
    @JoinTable()
    public tags: Tags[];
}

export default Tools;