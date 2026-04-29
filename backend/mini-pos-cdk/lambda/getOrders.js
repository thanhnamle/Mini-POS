const { Client } = require('pg');

const dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
};

exports.handler = async (event) => {
    const client = new Client(dbConfig);
    try {
        await client.connect();

        // Query to fetch orders joined with profile information
        const query = `
            SELECT o.*, p.full_name as customer_name, p.email as customer_email
            FROM orders o
            LEFT JOIN profiles p ON o.user_id = p.id
            ORDER BY o.created_at DESC;
        `;
        const result = await client.query(query);

        return {
            statusCode: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(result.rows),
        };
    } catch (error) {
        console.error('Error fetching orders:', error);
        return {
            statusCode: 500,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Failed to fetch orders', details: error.message }),
        };
    } finally {
        await client.end();
    }
};