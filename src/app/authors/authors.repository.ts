import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { Author } from "../../database/entity/Author";

@Service()
@EntityRepository(Author)
export default class AuthorsRepository extends Repository<Author> {
    async exists(id: string) {
        return (await this.count({ where: { id }, select: ["id"] })) > 0;
    }
}
