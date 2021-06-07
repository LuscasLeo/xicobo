import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./Book";

@Entity()
export class Author {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({ type: "date" })
    birth: Date;

    @ManyToMany((type) => Book, (book) => book.authors, { eager: true })
    @JoinTable()
    books: Book[] | string[];
}
