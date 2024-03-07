import dotenv from 'dotenv'
import express from 'express';
import cors from 'cors'
import helmet from 'helmet';
import morgan from 'morgan'
import winston  from 'winston';

import { Routes } from './routes';
import { BooksRepository } from './repositories/books';
import { UsersRepository } from './repositories/users';
import { BooksRentalRepository } from './repositories/books_rental';
import { CreateBooksController } from './controllers/books/create';
import { ReadBooksController } from './controllers/books/read';
import { UpdateBooksController } from './controllers/books/update';
import { DeleteBooksController } from './controllers/books/delete';
import { CreateUsersController } from './controllers/users/create';
import { ReadUsersController } from './controllers/users/read';
import { CreateBooksRentalController } from './controllers/books_rental/create';
import { ReadBooksRentalController } from './controllers/books_rental/read';
import { UpdateBooksRentalController } from './controllers/books_rental/update';
import { DeleteBooksRentalController } from './controllers/books_rental/delete';
import { UpdateUsersController } from './controllers/users/update';

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'
dotenv.config({ path: envFile });
const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.simple(),
    ),
    transports: [new winston.transports.Console()]
})

export class HttpServer {
    
    private _app: express.Express;

    constructor(){
        this._app = express();
    }

    public get app(){
        return this._app;
    }

    public setup(){
        this._app.use(morgan("dev", { logger: logger }))
        this._app.use(express.json());
        this._app.use(helmet())
        this._app.use(cors())
      
        const booksRepository = new BooksRepository()
        const usersRepository = new UsersRepository()
        const booksRentalRepository = new BooksRentalRepository()
      
        const createBooksController = new CreateBooksController(logger, booksRepository)
        const readBooksController = new ReadBooksController(logger, booksRepository)
        const updateBooksController = new UpdateBooksController(logger, booksRepository)
        const deleteBooksController = new DeleteBooksController(logger, booksRepository)
      
        const createUsersController = new CreateUsersController(logger, usersRepository)
        const readUsersController = new ReadUsersController(logger, usersRepository)
        const updateUsersController = new UpdateUsersController(logger, usersRepository)
      
        const createBooksRentalController = new CreateBooksRentalController(logger, booksRentalRepository)
        const readBooksRentalController = new ReadBooksRentalController(logger, booksRentalRepository)
        const updateBooksRentalController = new UpdateBooksRentalController(logger, booksRentalRepository)
        const deleteBooksRentalController = new DeleteBooksRentalController(logger, booksRentalRepository)
      
        this._app.use( 
          Routes({
            createBooksController,
            readBooksController,
            updateBooksController,
            deleteBooksController,
            createUsersController,
            readUsersController,
            updateUsersController,
            createBooksRentalController,
            readBooksRentalController,
            updateBooksRentalController,
            deleteBooksRentalController
          })
    )
    }

    public start(){
        const PORT = process.env.PORT || 3000
  
        this._app.listen(PORT, () => {
          logger.info({ message: 'Server started!' });
        });
    }
}