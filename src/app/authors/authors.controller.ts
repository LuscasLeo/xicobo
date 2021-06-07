import { IsDateString, IsString } from "class-validator";
import { Body, Get, HttpError, JsonController, Param, Post } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Author } from "../../database/entity/Author";
import { Book } from "../../database/entity/Book";
import AuthorsRepository from "./authors.repository";

class AuthorListOutput extends Array<AuthorOutput> {}

class AuthorOutput {
    @IsString()
    name: string;
}

class AuthorInput {
    @IsString()
    name: string;

    @IsDateString()
    birth: Date;

    books: BookInsert[];
}

class BookInsert {}

@OpenAPI({ security: [] })
@JsonController("/authors")
@Service()
export default class AuthorsController {
    constructor(@InjectRepository() private authorRepo: AuthorsRepository, @InjectRepository(Book) private bookRepo: Repository<Book>) {}

    @OpenAPI({
        description: "Lista todos os autores registrados",
    })
    @Get("/")
    async index(): Promise<AuthorListOutput> {
        return await this.authorRepo.find({ loadEagerRelations: false });
    }

    @Post()
    async createAuthor(
        @Body({
            required: true,
        })
        author: AuthorInput
    ) {
        const user = await this.authorRepo.save(Object.assign(new Author(), author));
        const books = await user.books;
        return { ...user, books };
    }

    @Get("/:id", { transformResponse: true })
    @OpenAPI({ summary: "Retorna a lista de Autores" })
    @ResponseSchema(AuthorOutput, { contentType: "application/json" })
    async getAuthor(@Param("id") id: string): Promise<AuthorOutput> {
        const { name } = await this.authorRepo.findOne(id, { loadEagerRelations: true, loadRelationIds: true });
        return {
            name,
        };
    }
}
