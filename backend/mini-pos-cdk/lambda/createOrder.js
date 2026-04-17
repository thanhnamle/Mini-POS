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
        let totalAmount = 0;
        if (requestBody.items && Array.isArray(requestBody.items)) {
            requestBody.items.forEach(item => {
                totalAmount += item.price * item.quantity;
            });
        }

        const createdAt = new Date().toISOString();

        // Create the new order object
        const newOrder = {
            orderId: crypto.randomUUID(),
            items: Array.isArray(requestBody.items) ? requestBody.items : [],
            total: totalAmount,
            totalAmount: totalAmount,
            status: requestBody.status || 'pending',
            createdAt,
            timestamp: createdAt,
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
    console.error("Error processing order:", error);
    
        return {
            statusCode: 500,
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                message: "Failed to create order",
                errorDetails: error.message,
                errorStack: error.stack
            }),
        };
    }
};
