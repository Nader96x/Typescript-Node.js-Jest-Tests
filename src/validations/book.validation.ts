import {NextFunction, Request, Response} from 'express';
import Joi, {ValidationResult} from 'joi';
import Book from "../models/book.model";
import {error} from "../utils/responses";

const bookValidationSchema = Joi.object({
    title: Joi.string().required().min(3).max(100),
    description: Joi.string().optional().min(20).max(250),
    author: Joi.string().required().min(3).max(100),
    publishYear: Joi.number().required().min(1900).max(new Date().getFullYear()),
});

const bookIdValidationSchema = Joi.object({
    id: Joi.string().hex().required().length(24)
});

export function validateBook(req: Request, res: Response, next: NextFunction) {
    const {error: validationError}: ValidationResult = bookValidationSchema.validate(req.body);
    if (validationError) {
        return error(res, validationError.details[0].message);
    }
    next();
}

export async function validateBookExistence(req: Request, res: Response, next: NextFunction) {
    const {id} = req.params;
    const {error: validationError}: ValidationResult = bookIdValidationSchema.validate({id});
    if (validationError) {
        return error(res, "id must be a valid mongo id");
    }
    const book = await Book.findById(id);
    if (!book) {
        return error(res, "Book not found", 404);
    }

    next();
}
