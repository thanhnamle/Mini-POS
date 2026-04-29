const { Client } = require('pg');

const dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Supabase connections
    }
};

exports.handler = async (event) => {
    const client = new Client(dbConfig);
    
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL is not defined in environment variables");
        }

        await client.connect();

        // Query to fetch all products from the Supabase 'products' table
        // We can join with categories if needed, but for now, let's keep it simple
        const query = 'SELECT * FROM products ORDER BY created_at DESC';
        const result = await client.query(query);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Ensure CORS is handled
            },
            body: JSON.stringify(result.rows),
        };
    } catch (error) {
        console.error('Error fetching products from Supabase:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ 
                error: 'Failed to fetch products',
                details: error.message 
            }),
        };
    } finally {
        await client.end();
    }
};