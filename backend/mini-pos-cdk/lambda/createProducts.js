const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const crypto = require('crypto');

const dbClient = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(dbClient);

const tableName = process.env.PRODUCTS_TABLE_NAME;

exports.handler = async (event) => {
    try {
        // Parse the incoming request body
        const requireBody = JSON.parse(event.body);

        // Generate a unique ID for the new product
        const newProduct = {
            productId: crypto.randomUUID(),
            name: requireBody.name,
            price: requireBody.price,
            category: requireBody.category || 'General',
        };

        const command = new ScanCommand({
            TableName: tableName,
            Item: newProduct,
        });

        await dynamo.send(command);

        return {
            statusCode: 201,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct),
        };
    } catch (error) {
        console.error('Error creating product:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: 'Failed to create product' }),
        };
    }
};