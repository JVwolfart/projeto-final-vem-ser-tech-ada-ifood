import { fakerEN } from "@faker-js/faker";
import { Book, NewBook } from "../../../src/controllers/models";
import {BooksModel} from "../../../src/db/models/Books";
import {HttpServer} from "../../../src/http-server";
import request from "supertest";
import { sequelize } from "../../../src/db/sequelize";

describe("PUT books/:id", () => {

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

    const newBook: NewBook = {
        title: fakerEN.word.words(),
        subtitle: fakerEN.word.words(),
        publishing_company: fakerEN.company.name(),
        published_at: fakerEN.date.anytime(),
        authors: fakerEN.internet.userName(),
    }

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

    it("should update book and return the correct values", async() => {
        const {app} = sut();
        const response = await request(app).put("/v1/books/" + books[0].id).send(newBook);
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(newBook.title);
    })

    it("should return 409 if there is already a book with the same title", async() => {
        const {app} = sut();
        const existingBook: NewBook = {title: books[1].title, subtitle: books[1].subtitle, publishing_company: books[1].publishing_company, authors: books[1].authors, published_at: books[1].published_at}
        const response = await request(app).put("/v1/books/" + books[0].id).send(existingBook);
        expect(response.status).toEqual(409);
        expect(response.body.message).toEqual('there is already a book with the same title provided');
    })

    it("should return 404 if there is no book with the provided id in the database", async() => {
        const {app} = sut();
        const response = await request(app).put("/v1/books/" + fakerEN.string.uuid()).send(newBook);
        expect(response.status).toEqual(404);
        expect(response.body.message).toEqual("any book with the id provided was founded");
    })

    it("should return error if something happened with database", async() => {
        await sequelize.close();
        const {app} = sut();
        const response = await request(app).put("/v1/books/" + books[0].id).send(newBook);
        expect(response.status).toEqual(500);
        expect(response.body.message).toEqual("something went wrong, try again latter!");
    })
})