import express, { Request, Response } from "express";
import cors from 'cors';
import { connectToPostgreSQL, testDatabaseConnection, executeQuery } from './util/database'; // Adjust the import path as necessary

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//GET API endpoint
app.get('/api/hello', (req: Request, res: Response) => {
    res.json({
        message: 'Hello from TypeScript Express API!',
        timestamp: new Date().toISOString(),
        status: 'success'
    });
});

app.get('/api/students/', async (req: Request, res: Response) => {
    try{
        const students = await executeQuery('SELECT * FROM student');
        res.status(200).json({
            message: 'Students data retrieved successfully',
            data: students,
            status: 'success'
        });

    }catch(error) {
        res.status(500).json({
            error: 'fail to get data from database',
            status: 'error'
        });
    }
})



app.post('/api/data', (req: Request, res: Response) => {
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

        // Insert data into PostgreSQL database
        executeQuery('INSERT INTO student (name, email, description) VALUES ($1, $2, $3)', [name, email, description])

        res.status(201).json({
            message: 'Data received successfully',
            data: processedData,
            status: 'success'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            status: 'error'
        });
        console.error(error);
    }
})


// Start the server
app.listen(PORT, async () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}`);
    console.log(`🔗 Try: http://localhost:${PORT}/api/hello`);

    // Connect to PostgreSQL database
    try {
        await connectToPostgreSQL();
        await testDatabaseConnection();

    } catch (error) {
        console.error('Error connecting to PostgreSQL:', error);
    }
});


export default app;