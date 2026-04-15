const { Stack, RemovalPolicy } = require('aws-cdk-lib/core');
const dynamodb = require('aws-cdk-lib/aws-dynamodb');
const lambda = require('aws-cdk-lib/aws-lambda');
const apigateway = require('aws-cdk-lib/aws-apigateway');
const path = require('path');
// const sqs = require('aws-cdk-lib/aws-sqs');

class MiniPosCdkStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // 1. Create DynamoDB tables for products and orders
    const productsTable = new dynamodb.Table(this, 'ProductsTable', {
      partitionKey: {name: 'productId', type: dynamodb.AttributeType.STRING},
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY
    });

    const ordersTable = new dynamodb.Table(this, 'OrdersTable', {
      partitionKey: {name: 'orderId', type: dynamodb.AttributeType.STRING},
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // 2. Create Lambda functions for handling API requests
    const getProductsLambda = new lambda.Function(this, 'GetProductsLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'getProducts.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        PRODUCTS_TABLE: productsTable.tableName,
      },
    });

    // Grant the Lambda function read permissions on the products table
    productsTable.grantReadData(getProductsLambda);

    // 3. Create API Gateway REST API
    const api = new apigateway.RestApi(this, 'MiniPosApi', {
      restApiName: 'Mini POS Service',
      description: 'This service serves products and orders for the Mini POS application.',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // 4. Define API resources and methods
    const productsResource = api.root.addResource('products');
    const getProductsIntegration = new apigateway.LambdaIntegration(getProductsLambda);
    productsResource.addMethod('GET', getProductsIntegration);
  }
}

module.exports = { MiniPosCdkStack }
