import { body, ValidationChain } from "express-validator";
import { Priority } from "../enums/Priority";
import { Status } from "../enums/Status";

export const createValidator: ValidationChain[] = [
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title mandatory')
        .trim()
        .isString()
        .withMessage("Title needs to be string"),
    body('date')
        .not()
        .isEmpty()
        .withMessage('Task date mandatory')
        .isString()
        .withMessage('Valid date format'),
    body('description')
        .trim()
        .isString()
        .withMessage('Description needs to be string'),
    body('priority')
        .trim()
        .isIn([Priority.high, Priority.normal, Priority.low])
        .withMessage('Priority can be high, normal or low'),
    body('status')
        .trim()
        .isIn([Status.todo, Status.inProgress, Status.completed])
        .withMessage('Status can be todo, inprogress or completed'),
];

export const updateValidator = [
    body('id')
        .not()
        .isEmpty()
        .withMessage('Task id mandatory')
        .trim()
        .isString()
        .withMessage('ID should be valid UUID format'),
    body('status')
        .trim()
        .isIn([Status.todo, Status.inProgress, Status.completed])
        .withMessage('Status can be todo, inprogress or completed'),
]