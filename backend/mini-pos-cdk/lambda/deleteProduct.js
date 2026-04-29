const { Client } = require('pg');

const dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
};

exports.handler = async (event) => {
    const client = new Client(dbConfig);
    try {
        const productId = event.pathParameters.productId;
        await client.connect();

        const query = 'DELETE FROM products WHERE id = $1';
        const result = await client.query(query, [productId]);

        if (result.rowCount === 0) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: 'Product not found' }),
            };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: `Product ${productId} deleted successfully` }),
        };
    } catch (error) {
        console.error('Error deleting product:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Failed to delete product', details: error.message }),
        };
    } finally {
        await client.end();
    }
};