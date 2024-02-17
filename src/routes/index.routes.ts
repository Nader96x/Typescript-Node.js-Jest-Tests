import express, {Router} from "express";

import BookRouter from "./book.routes";


const router: Router = express.Router();

router.use("/books", BookRouter);


export default router