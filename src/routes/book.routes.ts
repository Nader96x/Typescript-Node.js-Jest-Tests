import express, {Router} from 'express';
import {createBook, deleteBook, getBook, getBooks, updateBook} from '../controllers/book.controller';
import {validateBook, validateBookExistence} from "../validations/book.validation"

const router: Router = express.Router();

router.post('/', validateBook, createBook);
router.get('/', getBooks);
router.get('/:id', validateBookExistence, getBook);
router.put('/:id', validateBook, validateBookExistence, updateBook);
router.delete('/:id', validateBookExistence, deleteBook);

export default router;
