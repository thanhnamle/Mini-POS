const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const crypto = require("crypto");

const dbClient = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(dbClient);

const tableName = process.env.ORDERS_TABLE_NAME;

exports.handler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);

        // Calculate the total amount from the items array
        const totalAmount = 0;
        if (requestBody.items && Array.isArray(requestBody.items)) {
            requestBody.items.forEach(item => {
                totalAmount += item.price * item.quantity;
            });
        }

        // Create the new order object
        const newOrder = {
            orderId: crypto.randomUUID(),
            items: requestBody.items,
            totalAmount: totalAmount,
            timestamp: new Date().toISOString(),
        };

        // Save the new order to DynamoDB
        const command = new PutCommand({
            TableName: tableName,
            Item: newOrder,
        });

        await dynamo.send(command);

        return {
            statusCode: 201,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newOrder),
        };
    } catch (error) {
        console.error('Error creating order:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: 'Failed to create order' }),
        };
    }
};