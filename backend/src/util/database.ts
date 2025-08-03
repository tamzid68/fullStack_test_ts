import { Pool, PoolClient } from 'pg';


// PostgreSQL connection configuration
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'UniversityDB',
    password: process.env.DB_PASSWORD || 'asm_tamzid',
    port: parseInt(process.env.DB_PORT || '5432'),
});


// Function to connect to PostgreSQL
async function connectToPostgreSQL(): Promise<void> {
    try {
        const client: PoolClient = await pool.connect();
        console.log('Connected to PostgreSQL database successfully');
        client.release(); // Release the client back to the pool
    } catch (error) {
        console.error('Error connecting to PostgreSQL:', error);
        throw error;
    }
};

// Function to test database connection
async function testDatabaseConnection(): Promise<void> {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        console.log('Database connection test successful:', result.rows[0]);
        client.release(); // Release the client back to the pool

    } catch (error) {
        console.error('Error testing database connection:', error);
        throw error;
    }
};

// Function to get the pool instance
function getPool(): Pool {
    return pool;
};


//Function to execute a query
async function executeQuery(query: string, values?: any[]): Promise<any> {
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release(); // Release the client back to the pool
        return result.rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
};

export{
    connectToPostgreSQL,
    testDatabaseConnection,
    getPool,
    executeQuery
};