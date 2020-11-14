import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

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
}

export default Tools;