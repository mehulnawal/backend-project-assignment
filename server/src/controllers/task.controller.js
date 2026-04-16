import mongoose from "mongoose";
import apiResponse from "../config/apiResponse.config.js";
import { Task } from "../models/task.model.js";
import ApiError from "../utils/apiError.js";
import redisClient from "../config/redis.config.js";

export const getAllTask = async (req, res, next) => {
    try {

        const key = "tasks:all";
        let cacheData;

        try {
            cacheData = await redisClient.get(key);
        } catch (error) {
            console.log("Redis failed, using DB");
        }

        if (cacheData) {
            let parsedData;

            try {
                parsedData = JSON.parse(cacheData);
            } catch {
                parsedData = null;
            }

            if (parsedData)
                return res.status(200).json(apiResponse({
                    status: 200,
                    message: "All the tasks fetched from cache",
                    data: parsedData
                }));
        }


        const allTasks = await Task.find().sort({ "createdAt": -1 });

        try {
            await redisClient.set(key, JSON.stringify(allTasks), {
                EX: 60
            });
        } catch (err) {
            console.log("Redis set failed");
        }

        return res.status(200).json(apiResponse({ status: 200, message: "All the tasks fetched", data: allTasks }))

    } catch (error) {
        next(error);
        return;
    }
}

export const getAllOwnTask = async (req, res, next) => {
    try {

        const key = `tasks:user:${req.user._id}`;
        let cacheData;

        try {
            cacheData = await redisClient.get(key);
        } catch (err) {
            console.log("Redis failed in get users tasks, using DB");
        }

        if (cacheData) {
            let parsedData;

            try {
                parsedData = JSON.parse(cacheData);
            } catch {
                parsedData = null;
            }

            if (parsedData)
                return res.status(200).json(apiResponse({
                    status: 200,
                    message: "All users tasks fetched from cache",
                    data: parsedData
                }));
        }

        const allTasks = await Task.find({ owner: req.user._id }).sort({ "createdAt": -1 });


        try {
            await redisClient.set(key, JSON.stringify(allTasks), {
                EX: 60
            });
        } catch (err) {
            console.log("Redis set failed");
        }

        return res.status(200).json(apiResponse({ status: 200, message: "All owner tasks fetched", data: allTasks }))

    } catch (error) {
        next(error);
        return;
    }
}

export const createTask = async (req, res, next) => {

    try {

        const { title, description } = req.body;

        const newTask = new Task({
            title,
            description,
            owner: req.user._id
        })
        await newTask.save();

        try {
            await redisClient.del("tasks:all");
            await redisClient.del(`tasks:user:${req.user._id}`);
        } catch (err) {
            console.log("Redis set failed");
        }

        return res.status(201).json(apiResponse({ status: 201, message: "Task created", data: newTask }))

    } catch (error) {
        next(error);
        return;
    }
}

export const updateTask = async (req, res, next) => {

    try {

        const { id } = req.params;
        const { title, description } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id))
            return next(new ApiError(400, "Invalid task id"));

        let updatedDetails = {};

        const titleRegx = /^[a-zA-Z- ]+$/;
        if (title) {

            if (!titleRegx.test(title))
                return next(new ApiError(400, "Invalid title format"));

            updatedDetails.title = title;
        }

        if (description) {
            updatedDetails.description = description;
        }

        let updatedTask;

        if (req.user.userRole === 'admin') {
            updatedTask = await Task.findByIdAndUpdate(id, updatedDetails, { validateBeforeSave: false, new: true });
        } else {
            updatedTask = await Task.findOneAndUpdate(
                { _id: id, owner: req.user._id },
                updatedDetails,
                { new: true }
            );
        }

        if (!updatedTask)
            return next(new ApiError(404, "Task not found"));

        await redisClient.del("tasks:all");
        await redisClient.del(`tasks:user:${req.user._id}`);
        try {
            await redisClient.flushAll();
        } catch (err) {
            console.log("Redis set failed");
        }

        return res.status(200).json(apiResponse({ status: 200, message: "Task updated", data: updatedTask }))

    } catch (error) {
        next(error);
        return;
    }
}

export const deleteTask = async (req, res, next) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id))
            return next(new ApiError(400, "Invalid task id"));

        let task;

        if (req.user.userRole === 'admin') {
            task = await Task.findByIdAndDelete(id);
        } else {
            task = await Task.findOneAndDelete({ _id: id, owner: req.user._id });
        }

        if (!task)
            return next(new ApiError(404, "Task not found"));

        await redisClient.del("tasks:all");
        await redisClient.del(`tasks:user:${req.user._id}`);
        try {
            await redisClient.flushAll();
        } catch (err) {
            console.log("Redis set failed");
        }

        return res.status(200).json(apiResponse({ status: 200, message: "Task deleted", data: task }))

    } catch (error) {
        next(error);
        return;
    }
}