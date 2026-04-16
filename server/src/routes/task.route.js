import Router from 'express';
import { createTask, deleteTask, getAllOwnTask, getAllTask, updateTask } from '../controllers/task.controller.js';
import { taskValidator } from '../validators/taks.validator.js';
import checkValidation from '../middlewares/validation.middleware.js';
import { roleBaseAuth } from '../middlewares/roleCheck.middleware.js';
const taskRouter = Router();

taskRouter.get('/allTask', getAllTask);
taskRouter.get('/allOwnTask', getAllOwnTask);
taskRouter.post('/createTask', checkValidation(taskValidator), createTask);
taskRouter.patch('/updateTask/:id', updateTask);
taskRouter.delete('/deleteTask/:id', deleteTask);

export default taskRouter;