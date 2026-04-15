const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

// Initialize the DynamoDB client
const dbClient = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(dbClient);

const tableName = process.env.PRODUCTS_TABLE_NAME;

exports.handler = async (event) => {
  try {
    // Extract the productId from the URL path
    const productId = event.pathParameters.productId;

    // Delete the item from DynamoDB
    const command = new DeleteCommand({
      TableName: tableName,
      Key: {
        productId: productId,
      },
    });

    await dynamo.send(command);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: `Product ${productId} deleted successfully` }),
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to delete product." }),
    };
  }
};