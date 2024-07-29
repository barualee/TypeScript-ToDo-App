import { Router } from 'express';
import { tasksController } from './tasks.controller';
import { createValidator, updateValidator } from './tasks.validator';

//router function
export const tasksRouter: Router = Router();

//create default route
//telling js to fire this function as this endpoint is accessed.
tasksRouter.get('/tasks',tasksController.getAll);

tasksRouter.post('/tasks',
    createValidator, //middleware validator
    tasksController.create
);

tasksRouter.put('/tasks',
    updateValidator, //middleware validator
    tasksController.update
);