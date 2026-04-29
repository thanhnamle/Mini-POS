const { Client } = require('pg');

const dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
};

exports.handler = async (event) => {
    const client = new Client(dbConfig);
    try {
        const body = JSON.parse(event.body);
        const { user_id, items, payment_method, tax_rate = 8, discount_amount = 0 } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: 'Order must contain items' }),
            };
        }

        await client.connect();

        // Start Transaction
        await client.query('BEGIN');

        // 1. Calculate totals
        let subtotal = 0;
        items.forEach(item => {
            subtotal += item.price * (item.quantity || 1);
        });
        const taxAmount = subtotal * (tax_rate / 100);
        const totalAmount = subtotal + taxAmount - discount_amount;
        
        // Generate Order Number
        const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;

        // 2. Insert Order
        const orderQuery = `
            INSERT INTO orders (user_id, order_number, total_amount, subtotal, tax_rate, discount_amount, payment_method, items_count, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
        `;
        const orderResult = await client.query(orderQuery, [
            user_id || null,
            orderNumber,
            totalAmount,
            subtotal,
            tax_rate,
            discount_amount,
            payment_method || 'Cash',
            items.length,
            'completed'
        ]);
        const order = orderResult.rows[0];

        // 3. Insert Order Items & Update Stock
        for (const item of items) {
            const itemQuery = `
                INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, selected_size)
                VALUES ($1, $2, $3, $4, $5, $6);
            `;
            await client.query(itemQuery, [
                order.id,
                item.id || item.product_id,
                item.quantity || 1,
                item.price,
                item.price * (item.quantity || 1),
                item.selectedSize || item.selected_size || 'N/A'
            ]);

            // Update product stock
            const stockQuery = `
                UPDATE products 
                SET stock = stock - $1 
                WHERE id = $2 AND stock >= $1;
            `;
            const stockResult = await client.query(stockQuery, [item.quantity || 1, item.id || item.product_id]);
            
            if (stockResult.rowCount === 0) {
                throw new Error(`Insufficient stock for product: ${item.name || item.id}`);
            }
        }

        // 4. Update Loyalty Points & Total Spent (if user_id exists)
        if (user_id) {
            const pointsToEarn = Math.floor(totalAmount);
            const profileUpdateQuery = `
                UPDATE profiles 
                SET loyalty_points = loyalty_points + $1,
                    total_spent = total_spent + $2
                WHERE id = $3;
            `;
            await client.query(profileUpdateQuery, [pointsToEarn, totalAmount, user_id]);
        }

        // Commit Transaction
        await client.query('COMMIT');

        return {
            statusCode: 201,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                message: 'Order created successfully', 
                order: order,
                earned_points: user_id ? Math.floor(totalAmount) : 0
            }),
        };
    } catch (error) {
        // Rollback Transaction on error
        if (client) await client.query('ROLLBACK');
        console.error('Error creating order:', error);
        return {
            statusCode: 500,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Failed to create order', details: error.message }),
        };
    } finally {
        await client.end();
    }
};

