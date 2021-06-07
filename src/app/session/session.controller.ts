import bcrypt from "bcrypt";
import { IsDateString, IsString } from "class-validator";
import jwt from "jsonwebtoken";
import { Body, Get, HttpCode, HttpError, JsonController, Post, UseBefore } from "routing-controllers";
import { Service } from "typedi";
import { ILike, Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import configuration from "../../configuration";
import { User } from "../../database/entity/User";
import AuthenticationMiddleware from "../middlewares/authentication.middleware";
class LoginCredentials {
    @IsString()
    name: string;

    @IsString()
    password: string;
}

class SignUpCredentials extends LoginCredentials {
    @IsDateString()
    birth: Date;
}

@JsonController()
@Service()
export default class SessionController {
    constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

    private authenticate(id: any) {
        const token = jwt.sign({ id }, configuration.secretKey);
        return { token };
    }

    @Post("/signin")
    async signIn(@Body({ required: true, validate: true }) { name, password }: LoginCredentials) {
        const user = await this.userRepo.findOne({ where: { name: ILike(name) } });

        if (!user) {
            throw new HttpError(401, "User not found!");
        }

        try {
            if (!(await bcrypt.compare(password, user.password))) throw new HttpError(401, "Incorrect password!");
            return this.authenticate(user.id);
        } catch {
            throw new HttpError(401, "Incorrect password!");
        }
    }

    @Post("/signup")
    @HttpCode(201)
    async signup(@Body({ required: true }) { name, password, birth }: SignUpCredentials) {
        {
            const user = await this.userRepo.findOne({ where: { name } });
            if (user) throw new HttpError(401, "Username already in use.");
        }

        {
            const user = await this.userRepo.save(Object.assign(new User(), { name, password, birth }));
            const token = this.authenticate(user.id);
            return { user, token };
        }
    }

    @Get("/private")
    @UseBefore(AuthenticationMiddleware)
    privatePath() {
        return "You accesed the private path!";
    }
}
