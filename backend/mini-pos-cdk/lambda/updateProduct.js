const { Client } = require('pg');

const dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
};

exports.handler = async (event) => {
    const client = new Client(dbConfig);
    try {
        const productId = event.pathParameters.productId;
        const body = JSON.parse(event.body);
        await client.connect();

        const query = `
            UPDATE products 
            SET name = $1, description = $2, price = $3, stock = $4, category_id = $5, sku = $6, image_url = $7, updated_at = NOW()
            WHERE id = $8
            RETURNING *;
        `;
        
        const values = [
            body.name,
            body.description,
            Number(body.price),
            Number(body.stock),
            body.category_id,
            body.sku,
            body.image_url,
            productId
        ];

        const result = await client.query(query, values);

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
            body: JSON.stringify(result.rows[0]),
        };
    } catch (error) {
        console.error('Error updating product:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Failed to update product', details: error.message }),
        };
    } finally {
        await client.end();
    }
};
