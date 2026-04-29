const { Client } = require('pg');

const dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
};

exports.handler = async (event) => {
    const client = new Client(dbConfig);
    try {
        const body = JSON.parse(event.body);
        await client.connect();

        const query = `
            INSERT INTO products (name, description, price, stock, category_id, sku, image_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        
        const values = [
            body.name,
            body.description || '',
            Number(body.price || 0),
            Number(body.stock || 0),
            body.category_id || null, // Assuming UUID
            body.sku || '',
            body.image_url || ''
        ];

        const result = await client.query(query, values);

        return {
            statusCode: 201,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(result.rows[0]),
        };
    } catch (error) {
        console.error('Error creating product:', error);
        return {
            statusCode: 500,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Failed to create product', details: error.message }),
        };
    } finally {
        await client.end();
    }
};
