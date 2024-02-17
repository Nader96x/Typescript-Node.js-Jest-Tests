import express, {Express} from "express";
import appRouter from "./routes/index.routes"
import {_404, _500} from "./utils/middlewares";

const app: Express = express();

app.use(express.json());
app.use(appRouter);

app.use(_404); // 404 handler
app.use(_500); // 500 handler


export default app