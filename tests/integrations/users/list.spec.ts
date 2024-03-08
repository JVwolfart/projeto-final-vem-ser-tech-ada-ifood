import { fakerEN } from "@faker-js/faker";
import { User } from "../../../src/controllers/models";
import {HttpServer} from "../../../src/http-server";
import request from "supertest";
import { sequelize } from "../../../src/db/sequelize";
import { UsersModel } from "../../../src/db/models/Users";

describe("GET users/", () => {

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
        },
    ]

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

    it("should return all users in the database", async() => {
        const {app} = sut();
        const response = await request(app).get("/v1/users");
        expect(response.status).toEqual(200);
        expect(response.body).toHaveLength(2);
    })

    it("should return 204 with empty body if there are no users in the database", async() => {
        UsersModel.truncate({force: true});
        const {app} = sut();
        const response = await request(app).get("/v1/users");
        expect(response.status).toEqual(204);
        expect(response.body).toEqual({});
    })

    it("should return error if something happened with database", async() => {
        await sequelize.close();
        const {app} = sut();
        const response = await request(app).get("/v1/users");
        expect(response.status).toEqual(500);
        expect(response.body.message).toEqual("something went wrong, try again latter!");
    })
})