import { fakerEN } from "@faker-js/faker";
import { User, NewUser } from "../../../src/controllers/models";
import {HttpServer} from "../../../src/http-server";
import request from "supertest";
import { sequelize } from "../../../src/db/sequelize";
import { UsersModel } from "../../../src/db/models/Users";

describe("PUT users/:id", () => {
    const users: User[] = [
    {
        id: fakerEN.string.uuid(),
        name: fakerEN.internet.userName(),
        email: fakerEN.internet.email(),
    },

    {
        id: fakerEN.string.uuid(),
        name: fakerEN.internet.userName(),
        email: fakerEN.internet.email(),
    }
];

    const newUser: NewUser = {
        name: fakerEN.internet.userName(),
        email: fakerEN.internet.email(),
    }

    beforeEach(() => {
        jest.clearAllMocks();
    })

    beforeAll(async () => {
        await UsersModel.sequelize?.sync({force: true});
        await UsersModel.bulkCreate(users);
    })

    function sut(){
        const httpServer = new HttpServer();
        httpServer.setup();
        return {app: httpServer.app}
    }

    it("should update user and return the correct values", async() => {
        const {app} = sut();
        const response = await request(app).put("/v1/users/" + users[0].id).send(newUser);
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(newUser.name);
        expect(response.body.email).toEqual(newUser.email);
    })

    it("should return 404 if there is no user with the provided id", async() => {
        const {app} = sut();
        const response = await request(app).put("/v1/users/" + fakerEN.string.uuid()).send(newUser);
        expect(response.status).toEqual(404);
        expect(response.body.message).toEqual("any user with the id provided was founded");
    })

    it("should return 409 if there is a user with the same email", async() => {
        const {app} = sut();
        const existingUser: NewUser = {
            name: newUser.name,
            email: users[1].email
        }
        const response = await request(app).put("/v1/users/" + users[0].id).send(existingUser);
        expect(response.status).toEqual(409);
        expect(response.body.message).toEqual("there is already a user with the same email provided");
    })

    it("should return 409 if there is a user with the same name", async() => {
        const {app} = sut();
        const existingUser: NewUser = {
            name: users[1].name,
            email: newUser.email
        }
        const response = await request(app).put("/v1/users/" + users[0].id).send(existingUser);
        expect(response.status).toEqual(409);
        expect(response.body.message).toEqual("there is already a user with the same name provided");
    })

    it("should return error if something happened with database", async() => {
        await sequelize.close();
        const {app} = sut();
        const response = await request(app).put("/v1/users/" + users[0].id);
        expect(response.status).toEqual(500);
        expect(response.body.message).toEqual("something went wrong, try again later!");
    })
})