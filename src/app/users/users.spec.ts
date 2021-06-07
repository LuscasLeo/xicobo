import UserController from "./user.controller";
import UserService from "./user.service";
import { Repository, SelectQueryBuilder } from "typeorm";
import { mock } from "jest-mock-extended";

describe("UserController", () => {
    it("Shout be okay", async () => {
        jest.mock("typeorm", () => {
            const repositoryMock = mock<Repository<any>>();
            const qbuilderMock = mock<SelectQueryBuilder<any>>();
            qbuilderMock.where.mockReturnThis();
            qbuilderMock.select.mockReturnThis();
            repositoryMock.createQueryBuilder.mockReturnValue(qbuilderMock);

            return {
                getRepository: () => repositoryMock,

                BaseEntity: class Mock {},
                ObjectType: () => {},
                Entity: () => {},
                InputType: () => {},
                Index: () => {},
                PrimaryGeneratedColumn: () => {},
                Column: () => {},
                CreateDateColumn: () => {},
                UpdateDateColumn: () => {},
                OneToMany: () => {},
                ManyToOne: () => {},
            };
        });

        const repository = require("typeorm").getRepository();
        const userController = new UserController(new UserService(repository), repository);

        expect(userController.getAll()).toBeInstanceOf("array");
    });
});
