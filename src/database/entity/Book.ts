import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Author } from "./Author";

@Entity()
export class Book {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    pageCount: number;

    @Column()
    language: string;

    @ManyToMany((type) => Author, (author) => author.books, { eager: false })
    authors: Author[];
}
