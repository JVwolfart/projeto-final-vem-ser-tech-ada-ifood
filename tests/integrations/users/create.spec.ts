import { fakerEN } from "@faker-js/faker";
import { User, NewUser } from "../../../src/controllers/models";
import {HttpServer} from "../../../src/http-server";
import request from "supertest";
import { sequelize } from "../../../src/db/sequelize";
import { UsersModel } from "../../../src/db/models/Users";

describe("POST users/", () => {

    const user: User = {
        id: fakerEN.string.uuid(),
        name: fakerEN.internet.userName(),
        email: fakerEN.internet.email(),
    };

    const newUser: NewUser = {
        name: fakerEN.internet.userName(),
        email: fakerEN.internet.email(),
    }

    beforeEach(() => {
        jest.clearAllMocks();
    })

    beforeAll(async () => {
        await UsersModel.sync({force: true});
        await UsersModel.create(user);
    })

    function sut(){
        const httpServer = new HttpServer();
        httpServer.setup();
        return {app: httpServer.app}
    }

    it("should create user and return the correct values", async() => {
        const {app} = sut();
        const response = await request(app).post("/v1/users/").send(newUser);
        expect(response.status).toEqual(201);
        expect(response.body.name).toEqual(newUser.name);
        expect(response.body.email).toEqual(newUser.email);
    })

    it("should return empty body with status code 409 if there is a user with the same email", async () => {
        const {app} = sut();
        const existingUser: NewUser = {name: user.name, email: user.email};
        const response = await request(app).post("/v1/users/").send(existingUser);
        expect(response.status).toEqual(409);
        expect(response.body.message).toEqual('user with the same email already existe');
    })

    it("should return error if something happened with database", async() => {
        await sequelize.close();
        const {app} = sut();
        const response = await request(app).post("/v1/users/");
        expect(response.status).toEqual(500);
        expect(response.body.message).toEqual("something went wrong, try again latter!");
    })
})