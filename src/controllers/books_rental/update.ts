import { Request, Response } from "express";
import { IBooksRentalRepository } from "../interfaces";
import { Logger } from "winston";

export class UpdateBooksRentalController {
  constructor(
    private readonly logger: Logger,
    private readonly booksRentalRepository: IBooksRentalRepository
  ) {}

  public async update(req: Request, res: Response): Promise<void> {
    const {id} = req.params;
    const newRental = req.body;
    try {
      const rental = await this.booksRentalRepository.getById(id);
      if(!rental){
        res.status(404);
        return;
      }
      console.log(newRental.book_id);
      const isAvaliable = await this.booksRentalRepository.getByBookId(newRental.book_id);
      console.log(isAvaliable);
      if(isAvaliable){
        console.log("Cheguei aqui");
        
        res.status(409);
        return;
      }
      const bookRental = await this.booksRentalRepository.update(id, newRental);
      res.status(200).json(bookRental)
    } catch (error) {
      
      res.status(500).json({ message: 'something went wrong, try again latter!' }) // JV
    }
  }
}