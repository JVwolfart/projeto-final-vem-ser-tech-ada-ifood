import { fakerEN } from "@faker-js/faker";
import { Book } from "../../../src/controllers/models";
import {BooksModel} from "../../../src/db/models/Books";
import {HttpServer} from "../../../src/http-server";
import request from "supertest";
import { sequelize } from "../../../src/db/sequelize";

describe("GET books/:id", () => {

    const book: Book = {
        id: fakerEN.string.uuid(),
        title: fakerEN.word.words(),
        subtitle: fakerEN.word.words(),
        publishing_company: fakerEN.company.name(),
        published_at: fakerEN.date.anytime(),
        authors: fakerEN.internet.userName(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    })

    beforeAll(async () => {
        await BooksModel.sequelize?.sync({force: true});
        await BooksModel.create(book);
    })

    function sut(){
        const httpServer = new HttpServer();
        httpServer.setup();
        return {app: httpServer.app}
    }

    it("should return book with the same id", async() => {
        const {app} = sut();
        const response = await request(app).get("/v1/books/" + book.id);
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(book.title);
    })

    it("should return empty body with status code 204 if the id provided is not present in the database", async () => {
        const {app} = sut();
        const response = await request(app).get("/v1/books/" + fakerEN.string.uuid());
        expect(response.status).toEqual(204);
        expect(response.body).toEqual({});
    })

    it("should return error if something happened with database", async() => {
        await sequelize.close();
        const {app} = sut();
        const response = await request(app).get("/v1/books/" + book.id);
        expect(response.status).toEqual(500);
        expect(response.body.message).toEqual("something went wrong, try again latter!");
    })
})