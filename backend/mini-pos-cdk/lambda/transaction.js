const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
    const method = event.httpMethod;

    if (method === 'POST') {
        const body = JSON.parse(event.body);

        const items = {
            id: Date.now().toString(),
            amount: body.amount,
            method: body.method,
            status: 'PENDING',
            createdAt: new Date().toISOString()
        }
    }
}