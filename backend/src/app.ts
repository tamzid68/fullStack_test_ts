import express from "express";
import cors from 'cors';
import { connectToPostgreSQL, testDatabaseConnection } from './util/database'; // Adjust the import path as necessary
import router from './routes/student.routes'; // Adjust the import path as necessary

const app = express();
const PORT = process.env.PORT || 3000;


//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//GET API endpoint
app.use('/api', router);

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