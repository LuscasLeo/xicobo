import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../../database/entity/User";

@Service()
export default class UserService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}
    async getUsers() {
        const a = await this.repo.findOne(1);
        return "This action returns all users";
    }
}
