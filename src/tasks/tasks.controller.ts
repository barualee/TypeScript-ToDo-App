import { validationResult } from "express-validator";
import { AppDataSource } from "../..";
import { Task } from "./tasks.entity";
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Request, Response } from "express";
import { UpdateResult } from "typeorm";

class TasksController {
    //method for get route
    public async getAll(req: Request, res: Response): Promise<Response> {
        
        //declare variable to hold all tasks
        let allTasks: Task[];

        try {
            //fetch all tasks from repo
            allTasks = await AppDataSource.getRepository(Task,).find({
                order: {
                    date: 'ASC',
                },
            });
            //convert to array of objects
            allTasks = instanceToPlain(allTasks) as Task[];
            return res.json(allTasks).status(200);
        
        } catch (errors) {
            return res
                .json({ error: 'Internal Server Error'})
                .status(500);
        }
    }

    //method for post route
    public async create(req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        //create new instance of task
        const newTask = new Task();

        //add properties to task object
        newTask.title = req.body.title;
        newTask.description = req.body.description;
        newTask.date = req.body.date;
        newTask.priority = req.body.priority;
        newTask.status = req.body.status;

        //save to DB
        let createdTask: Task;

        try {
            createdTask = await AppDataSource.getRepository(Task).save(newTask);
        
            //convert task instance to object
            createdTask = instanceToPlain(createdTask) as Task;

            return res.json(createdTask).status(201);
        } catch (errors) {
            return res
                .json({ error: 'Internal Server Error'})
                .status(500);
        }
    }

    //method to update
    public async update(req:Request, res: Response): Promise<Response> {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        //try to find if task exist
        let task: Task | null;

        try {
            task = await AppDataSource.getRepository(Task)
                .findOne({where: { id: req.body.id },});
        } catch (errors) {
            return res
                .json({ error: 'Internal Server Error'})
                .status(500);
        }
        //return 400 if task not found
        if(!task) {
            return res.status(404).json({error:'ID does not exist'});
        }

        //declre variable for updatedTask
        let updatedTask: UpdateResult;
        
        //update the task
        try {
            updatedTask = await AppDataSource.getRepository(Task,)
                .update(req.body.id, plainToInstance(Task, {
                    status: req.body.status,
                }),
            );
            //convert updated task to instance object
            updatedTask = instanceToPlain(updatedTask) as UpdateResult;
            return res.json(updatedTask).status(200);
        } catch (errors) {
            return res
                .json({ error: 'Internal Server Error'})
                .status(500);
        }
    }
}
export const tasksController = new TasksController();