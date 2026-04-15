const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

// Initialize the DynamoDB client
const dbClient = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(dbClient);

const tableName = process.env.PRODUCTS_TABLE_NAME;

exports.handler = async (event) => {
  try {
    // Extract the productId from the URL path
    const productId = event.pathParameters.productId;
    const requestBody = JSON.parse(event.body);

    // Update the item in DynamoDB
    const command = new UpdateCommand({
      TableName: tableName,
      Key: {
        productId: productId,
      },
      // Using expression attributes to avoid reserved word conflicts (like 'name')
      UpdateExpression: "set #n = :n, price = :p, category = :c",
      ExpressionAttributeNames: {
        "#n": "name",
      },
      ExpressionAttributeValues: {
        ":n": requestBody.name,
        ":p": requestBody.price,
        ":c": requestBody.category,
      },
      ReturnValues: "ALL_NEW", // Returns the item as it appears after the update
    });

    const response = await dynamo.send(command);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message: "Product updated successfully", 
        updatedProduct: response.Attributes 
      }),
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to update product." }),
    };
  }
};