// tests/controllers/book.controller.test.ts
import {NextFunction, Request, Response} from 'express';
import {createBook, deleteBook, getBook, getBooks, updateBook} from '../controllers/book.controller';
import {validateBook, validateBookExistence} from '../validations/book.validation';
import Book, {BookInterface} from '../../src/models/book.model';
import * as responses from '../utils/responses';
import SpyInstance = jest.SpyInstance;

interface BookMock extends BookInterface {
    _id: string
}

// Mocking the external dependencies
jest.mock('../../src/models/book.model');
jest.mock('../../src/utils/utils', () => {
    return {
        asyncHandler: jest.fn((fn) => fn)
    }
});

jest.mock('../../src/utils/utils', () => ({
    asyncHandler: (fn: Function) => (req: Request, res: Response) => fn(req, res),
}));


describe('Book Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    let success: SpyInstance;
    let error: SpyInstance;


    beforeEach(() => {
        jest.clearAllMocks();
        req = {} as Request;
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;
        next = jest.fn();
        success = jest.spyOn(responses, 'success');
        error = jest.spyOn(responses, 'error');
    });

    describe("check validateBookExistence Middleware", () => {
        it('should return 400 if id is invalid', async () => {
            req.params = {
                id: 'invalidId' // not 24 hex letters string
            };

            await validateBookExistence(req as Request, res as Response, jest.fn());

            expect(error).toHaveBeenCalled();
            expect(error).toHaveBeenCalledTimes(1);
            expect(error).toHaveBeenCalledWith(res, "id must be a valid mongo id");


            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'id must be a valid mongo id',
                errorStack: null
            });
        });

        it('should return 404 if book is not found', async () => {
            req.params = {
                id: "65cfab54334445fc48b1776e" // valid mongo id but not found
            };

            (Book.findById as jest.Mock).mockResolvedValue(null);

            await validateBookExistence(req as Request, res as Response, jest.fn());

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Book not found',
                errorStack: null
            });
        });

        it('should call next if book is found', async () => {
            req.params = {
                id: '65cfab54334445fc48b1776e' // Valid mongo id
            };

            (Book.findById as jest.Mock).mockResolvedValue(true);


            await validateBookExistence(req as Request, res as Response, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('check validateBook Middleware', () => {

        it('should return 400 if title is missing', async () => {
            req.body = {
                description: 'Test Description',
            };

            const next = jest.fn();
            validateBook(req as Request, res as Response, next);

            expect(next).not.toHaveBeenCalled();
            expect(error).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: expect.stringContaining('"title" is required'),
            }));
        });

        it('should return 400 if publishYear greater than this year', async () => {
            req.body = {
                title: 'Test Title',
                author: 'Test Author',
                publishYear: 2030,
            };

            validateBook(req as Request, res as Response, next);

            expect(next).not.toHaveBeenCalled();
            expect(error).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: expect.stringContaining('"publishYear" must be less than or equal to ' + new Date().getFullYear()),
            }));
        });

        it('should call next if book is valid', () => {
            req.body = {
                title: 'Test Title',
                author: 'Test Author',
                publishYear: 2020,
            };
            validateBook(req as Request, res as Response, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('check createBook functionality', () => {
        it('should successfully create a book', async () => {
            req.body = {
                title: 'Test Title',
                description: 'Test Description',
                author: 'Test Author',
                publishYear: 2020,
            };
            const savedBook = {
                ...req.body,
                _id: 'someId',
            };

            (Book.prototype.save as jest.Mock).mockResolvedValue(savedBook);

            await createBook(req as Request, res as Response, next);

            expect(Book.prototype.save).toHaveBeenCalled();

            expect(success).toHaveBeenCalled();
            expect(success).toHaveBeenCalledWith(res, 'Book created successfully', savedBook, 201);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Book created successfully',
                data: savedBook,
            });
        });
    });

    describe('check getBooks functionality', () => {
        it('should return all books', async () => {
            const books: BookMock[] = [
                {
                    _id: 'someId',
                    title: 'Test Title',
                    description: 'Test Description',
                    author: 'Test Author',
                    publishYear: 2020,
                },
                {
                    _id: 'someId2',
                    title: 'Test Title 2',
                    description: 'Test Description 2',
                    author: 'Test Author 2',
                    publishYear: 2021,
                }
            ];

            (Book.find as jest.Mock).mockResolvedValue(books);

            await getBooks({} as Request, res as Response, next);

            expect(Book.find).toHaveBeenCalled();
            expect(Book.find).toHaveBeenCalledTimes(1);

            expect(success).toHaveBeenCalled();
            expect(success).toHaveBeenCalledWith(res, 'Books fetched successfully', books);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Books fetched successfully',
                data: books,
            });
        });
    });

    describe('check getBook functionality', () => {
        it('should return a book', async () => {
            const book: BookMock = {
                _id: 'someId',
                title: 'Test Title',
                description: 'Test Description',
                author: 'Test Author',
                publishYear: 2020,
            };

            req.params = {
                id: 'someId'
            };

            (Book.findById as jest.Mock).mockResolvedValue(book);

            await getBook(req as Request, res as Response, next);

            expect(Book.findById).toHaveBeenCalled();
            expect(Book.findById).toHaveBeenCalledTimes(1);
            expect(Book.findById).toHaveBeenCalledWith('someId');

            expect(success).toHaveBeenCalled();
            expect(success).toHaveBeenCalledWith(res, 'Book fetched successfully', book);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Book fetched successfully',
                data: book,
            });
        });
    });

    describe('check updateBook functionality', () => {
        it('should update a book', async () => {
            const updatedBookData: BookInterface = {
                title: 'Updated Title',
                description: 'Updated Description',
                author: 'Updated Author',
                publishYear: 2021,
            }

            const updatedBook: BookMock = {
                _id: 'someId',
                ...updatedBookData
            }


            const req = {
                params: {
                    id: 'someId'
                },
                body: updatedBookData
            } as unknown as Request;

            (Book.updateOne as jest.Mock).mockResolvedValue({n: 1});
            (Book.findById as jest.Mock).mockResolvedValue(updatedBook);

            await updateBook(req as Request, res as Response, jest.fn());

            expect(Book.updateOne).toHaveBeenCalled();
            expect(Book.updateOne).toHaveBeenCalledTimes(1);
            expect(Book.updateOne).toHaveBeenCalledWith({_id: req.params.id}, updatedBookData);

            expect(success).toHaveBeenCalled();
            expect(success).toHaveBeenCalledTimes(1);
            expect(success).toHaveBeenCalledWith(res, 'Book updated successfully', updatedBook);


            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Book updated successfully',
                data: updatedBook,
            });
        });
    });

    describe('check deleteBook functionality', () => {
        it('should delete a book', async () => {
            req.params = {
                id: 'someId'
            };

            await deleteBook(req as Request, res as Response, jest.fn());

            expect(Book.deleteOne).toHaveBeenCalled();
            expect(Book.deleteOne).toHaveBeenCalledTimes(1);
            expect(Book.deleteOne).toHaveBeenCalledWith({_id: 'someId'});

            expect(success).toHaveBeenCalled();
            expect(success).toHaveBeenCalledTimes(1);
            expect(success).toHaveBeenCalledWith(res, 'Book deleted successfully');

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Book deleted successfully',
                data: null
            });
        });
    });
});
