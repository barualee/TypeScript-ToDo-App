import express, { Express } from "express";
import dotenv from "dotenv";
import { DataSource } from 'typeorm';
import cors from 'cors';
import bodyParser from "body-parser";
import { Task } from './src/tasks/tasks.entity';
import { tasksRouter } from "./src/tasks/tasks.router";

//instantiate express app
const app: Express = express();
dotenv.config();

//Parse request body
app.use(bodyParser.json());

//cors install types
app.use(cors());

//create DB connection
export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    entities:[Task],
    synchronize: true,
});

//define server port
const port = process.env.PORT;

AppDataSource.initialize()
.then(() => {
    //start listening to requests
    app.listen(port);
    console.log('Data source initialized!');
})
.catch((err) => {
    console.error(
        'Error during initialisation',
        err,
    );
});

app.use('/', tasksRouter);