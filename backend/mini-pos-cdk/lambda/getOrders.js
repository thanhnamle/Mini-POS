const { Client } = require('pg');

const dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
};

exports.handler = async (event) => {
    const client = new Client(dbConfig);
    try {
        await client.connect();

        // Query to fetch orders joined with profile information and aggregated items
        const query = `
            SELECT o.*, p.full_name as customer_name, p.email as customer_email,
                   COALESCE(json_agg(json_build_object(
                       'id', oi.id,
                       'quantity', oi.quantity,
                       'unit_price', oi.unit_price,
                       'selected_size', oi.selected_size,
                       'products', json_build_object('name', pr.name)
                   )) FILTER (WHERE oi.id IS NOT NULL), '[]') as order_items
            FROM orders o
            LEFT JOIN profiles p ON o.user_id = p.id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products pr ON oi.product_id = pr.id
            GROUP BY o.id, p.full_name, p.email
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