import { fakerEN } from "@faker-js/faker";
import { User } from "../../../src/controllers/models";
import {HttpServer} from "../../../src/http-server";
import request from "supertest";
import { sequelize } from "../../../src/db/sequelize";
import { UsersModel } from "../../../src/db/models/Users";

describe("GET users/:id", () => {

    const user: User = {
        id: fakerEN.string.uuid(),
        name: fakerEN.internet.userName(),
        email: fakerEN.internet.email(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    })

    beforeAll(async () => {
        await UsersModel.sequelize?.sync({force: true});
        await UsersModel.create(user);
    })

    function sut(){
        const httpServer = new HttpServer();
        httpServer.setup();
        return {app: httpServer.app}
    }

    it("should return user with the same id", async() => {
        const {app} = sut();
        const response = await request(app).get("/v1/users/" + user.id);
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(user.name);
        expect(response.body.email).toEqual(user.email);
    })

    it("should return empty body with status code 204 if the id provided is not present in the database", async () => {
        const {app} = sut();
        const response = await request(app).get("/v1/users/" + fakerEN.string.uuid());
        expect(response.status).toEqual(204);
        expect(response.body).toEqual({});
    })

    it("should return error if something happened with database", async() => {
        await sequelize.close();
        const {app} = sut();
        const response = await request(app).get("/v1/users/" + user.id);
        expect(response.status).toEqual(500);
        expect(response.body.message).toEqual("something went wrong, try again latter!");
    })
})