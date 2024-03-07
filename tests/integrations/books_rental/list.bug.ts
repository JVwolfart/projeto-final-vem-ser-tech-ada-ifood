import { fakerEN } from "@faker-js/faker";
import { Book, BooksRental, User } from "../../../src/controllers/models";
import {HttpServer} from "../../../src/http-server";
import request from "supertest";
import { sequelize } from "../../../src/db/sequelize";
import { BooksRentalModel } from "../../../src/db/models/BooksRental";
import { BooksModel } from "../../../src/db/models/Books";
import { UsersModel } from "../../../src/db/models/Users";

/*describe("GET rental/books", () => {

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

    const books: Book[] = [
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
    ]
    
    const rental: BooksRental = {
            id: fakerEN.string.uuid(),
            book_id: users[0].id,
            user_id: books[0].id,
            rented_at: fakerEN.date.anytime(),
            rental_time: fakerEN.date.anytime(),
    };
    

    beforeEach(() => {
        jest.clearAllMocks();
    })

    beforeAll(async () => {
        try {
            await BooksModel.sync({force: true});
            await UsersModel.sync({force: true});
            await BooksRentalModel.sync({force: true});
            await UsersModel.bulkCreate(users);
            await BooksModel.bulkCreate(books);
            await BooksRentalModel.create(rental, {});
        } catch (error) {
            console.log(error);
        }
    })

    function sut(){
        const httpServer = new HttpServer();
        httpServer.setup();
        return {app: httpServer.app}
    }

    it("test", async() => {
        expect(1).toEqual(1);
    })
})*/