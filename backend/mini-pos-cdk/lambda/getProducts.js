const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

// Initialize the DynamoDB client
const dbClient = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(dbClient);

const tableName = process.env.PRODUCTS_TABLE_NAME;

exports.handler = async (event) => {
    try {
        const command = new ScanCommand({
            TableName: tableName,
        });

        const result = await dynamo.send(command);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(result.Items),
        };
    } catch (error) {
        console.error('Error fetching products:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: 'Failed to fetch products' }),
        };
    }
};