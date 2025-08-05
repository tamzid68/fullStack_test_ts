import { Request, Response } from "express";
import { executeQuery } from "../util/database";

const serverCheck = async (req: Request, res: Response) => {
    res.json({
        message: 'Hello from TypeScript Express API!',
        timestamp: new Date().toISOString(),
        status: 'success'
    });
};

const getStudents = async (req: Request, res: Response) => {
    try {

        const students = await executeQuery('SELECT * FROM student');

        res.status(200).json({
            message: 'Students Data retrieved successfully',
            data: students,
            status: 'success'
        })

    } catch (error) {
        res.status(500).json({
            error: 'fail to get data from database',
            status: 'error'
        });
    }
};

const createStudent = async (req: Request, res: Response) => {
    try {
        const { name, email, description } = req.body;
        if (!name || !email || !description) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const processedData = {
            id: Date.now().toString(),
            name,
            email,
            description,
            receivedAt: new Date().toISOString(),
        };

        console.log('Received data:', processedData);

        await executeQuery('INSERT INTO student (name, email, description) VALUES ($1, $2, $3)', [name, email, description]);

        res.status(201).json({
            message: 'Data received successfully',
            data: processedData,
            status: 'success'
        });

    } catch (error: any) {
        if (error.code === '23505') {
            return res.status(409).json({
                error: 'Email is already registered',
                status: 'error'
            });
        }
        res.status(500).json({
            error: 'Internal server error',
            status: 'error'
        });
        console.error(error);
    }
};



export { serverCheck, getStudents, createStudent };