import { fakerEN } from "@faker-js/faker";
import { Book } from "../../../src/controllers/models";
import {BooksModel} from "../../../src/db/models/Books";
import {HttpServer} from "../../../src/http-server";
import request from "supertest";
import { sequelize } from "../../../src/db/sequelize";

describe("DELETE books/:id", () => {

    const books: Book[] =
    [
        {
            id: fakerEN.string.uuid(),
            title: fakerEN.word.words(),
            subtitle: fakerEN.word.words(),
            publishing_company: fakerEN.company.name(),
            published_at: fakerEN.date.anytime(),
            authors: fakerEN.internet.userName(),
        },

        {
            id: fakerEN.string.uuid(),
            title: fakerEN.word.words(),
            subtitle: fakerEN.word.words(),
            publishing_company: fakerEN.company.name(),
            published_at: fakerEN.date.anytime(),
            authors: fakerEN.internet.userName(),
        },
    ];


    beforeEach(() => {
        jest.clearAllMocks();
    })

    beforeAll(async () => {
        await BooksModel.sequelize?.sync({force: true});
        await BooksModel.bulkCreate(books);
    })

    function sut(){
        const httpServer = new HttpServer();
        httpServer.setup();
        return {app: httpServer.app}
    }

    it("should delete book and return empty body", async() => {
        const {app} = sut();
        const response = await request(app).delete("/v1/books/" + books[0].id);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({});
    })

    it("should return 404 and not delete book if the provided id is not in the database", async() => {
        const {app} = sut();
        const response = await request(app).delete("/v1/books/" + fakerEN.string.uuid());
        expect(response.status).toEqual(404);
        expect(response.body.message).toEqual("any book with the id provided was founded");
    })

    it("should return error if something happened with database", async() => {
        await sequelize.close();
        const {app} = sut();
        const response = await request(app).delete("/v1/books/" + books[0].id);
        expect(response.status).toEqual(500);
        expect(response.body.message).toEqual("something went wrong, try again latter!");
    })
})