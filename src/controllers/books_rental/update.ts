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
        res.status(404).json({message: "rental not found"});
        return;
      }
      const isAvaliable = await this.booksRentalRepository.getByBookId(newRental.book_id);
      if(isAvaliable){
        
        res.status(409).json({message: "book already rented"});
        return;
      }
      const bookRental = await this.booksRentalRepository.update(id, newRental);
      res.status(200).json(bookRental)
    } catch (error) {
      
      res.status(500).json({ message: 'something went wrong, try again latter!' }) // JV
    }
  }
}