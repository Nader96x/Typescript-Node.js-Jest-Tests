import {NextFunction, Request, Response} from 'express';
import Book from '../models/book.model';
import {success} from "../utils/responses";
import {asyncHandler} from "../utils/utils";

export const createBook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const book = new Book({
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        publishYear: req.body.publishYear,
    });

    const savedBook = await book.save();
    return success(res, "Book created successfully", savedBook, 201);
});

export const getBooks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const books = await Book.find();
    return success(res, "Books fetched successfully", books);
});

export const getBook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const book = await Book.findById(req.params.id);
    return success(res, "Book fetched successfully", book);
});

export const updateBook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const book = await Book.updateOne({_id: req.params.id}, {
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        publishYear: req.body.publishYear,
    });
    return success(res, "Book updated successfully", await Book.findById(req.params.id));
});

export const deleteBook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await Book.deleteOne({_id: req.params.id});
    return success(res, "Book deleted successfully");
});