import { fakerEN } from "@faker-js/faker";
import { Book, NewBook } from "../../../src/controllers/models";
import {BooksModel} from "../../../src/db/models/Books";
import {HttpServer} from "../../../src/http-server";
import request from "supertest";
import { sequelize } from "../../../src/db/sequelize";

describe("POST books/", () => {

    const book: Book = {
            id: fakerEN.string.uuid(),
            title: fakerEN.word.words(),
            subtitle: fakerEN.word.words(),
            publishing_company: fakerEN.company.name(),
            published_at: fakerEN.date.anytime(),
            authors: fakerEN.internet.userName(),
    };

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
        await BooksModel.sync({force: true});
        await BooksModel.create(book);
    })

    function sut(){
        const httpServer = new HttpServer();
        httpServer.setup();
        return {app: httpServer.app}
    }

    it("should create book and return the correct values", async() => {
        const {app} = sut();
        const response = await request(app).post("/v1/books").send(newBook);
        expect(response.status).toEqual(201);
        expect(response.body.title).toEqual(newBook.title);
    })

    it("should return 409 if there is already a book with the same title", async() => {
        const {app} = sut();
        const existingBook: NewBook = {title: book.title, subtitle: book.subtitle, publishing_company: book.publishing_company, authors: book.authors, published_at: book.published_at}
        const response = await request(app).post("/v1/books").send(existingBook);
        expect(response.status).toEqual(409);
        expect(response.body.message).toEqual('book with the same title already existe');
    })

    it("should return error if something happened with database", async() => {
        await sequelize.close();
        const {app} = sut();
        const response = await request(app).post("/v1/books").send(newBook);
        expect(response.status).toEqual(500);
        expect(response.body.message).toEqual("something went wrong, try again latter!");
    })
})