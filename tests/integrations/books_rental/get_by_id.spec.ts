import { fakerEN } from "@faker-js/faker";
import { Book, BooksRental, User } from "../../../src/controllers/models";
import {HttpServer} from "../../../src/http-server";
import request from "supertest";
import { sequelize } from "../../../src/db/sequelize";
import { BooksRentalModel } from "../../../src/db/models/BooksRental";
import { BooksModel } from "../../../src/db/models/Books";
import { UsersModel } from "../../../src/db/models/Users";

describe("GET rental/books/:id", () => {

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
    
    const rentals: BooksRental[] = [
        {
            id: fakerEN.string.uuid(),
            book_id: books[0].id,
            user_id: users[0].id,
            rented_at: fakerEN.date.anytime(),
            rental_time: fakerEN.date.anytime(),
        },

        {
            id: fakerEN.string.uuid(),
            book_id: books[1].id,
            user_id: users[1].id,
            rented_at: fakerEN.date.anytime(),
            rental_time: fakerEN.date.anytime(),
        }
    ];
    

    beforeEach(() => {
        jest.clearAllMocks();
    })

    beforeAll(async () => {
        try {
            await BooksModel.sequelize?.sync({force: true});
            await UsersModel.sequelize?.sync({force: true});
            await BooksRentalModel.sequelize?.sync({force: true});
            await UsersModel.bulkCreate(users);
            await BooksModel.bulkCreate(books);
            await BooksRentalModel.bulkCreate(rentals);
        } catch (error) {
            console.log(error.message);
        }
    })

    function sut(){
        const httpServer = new HttpServer();
        httpServer.setup();
        return {app: httpServer.app}
    }

    it("should return book rental with the same id", async() => {
        const {app} = sut();
        const response = await request(app).get("/v1/rental/books/" + rentals[0].id);
        expect(response.status).toEqual(200);
        expect(response.body.book_id).toEqual(rentals[0].book_id);
        expect(response.body.user_id).toEqual(rentals[0].user_id);
    })

    it("should return empty body with status code 204 if the id provided is not present in the database", async() => {
        const {app} = sut();
        const response = await request(app).get("/v1/rental/books/" + fakerEN.string.uuid());
        expect(response.status).toEqual(204);
        expect(response.body).toEqual({});
    })

    it("should return error if something happened with database", async() => {
        await sequelize.close();
        const {app} = sut();
        const response = await request(app).get("/v1/rental/books/" + rentals[0].id);
        expect(response.status).toEqual(500);
        expect(response.body.message).toEqual("something went wrong, try again latter!");
    })
})