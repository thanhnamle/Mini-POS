const { Stack, RemovalPolicy, CfnOutput } = require('aws-cdk-lib');
const dynamodb = require('aws-cdk-lib/aws-dynamodb');
const lambda = require('aws-cdk-lib/aws-lambda');
const apigateway = require('aws-cdk-lib/aws-apigateway');
const path = require('path');
// const sqs = require('aws-cdk-lib/aws-sqs');

class MiniPosCdkStack extends Stack {
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
        PRODUCTS_TABLE_NAME: productsTable.tableName,
      },
    });

    const createProductLambda = new lambda.Function(this, 'CreateProductLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'createProduct.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        PRODUCTS_TABLE_NAME: productsTable.tableName,
      },
    });

    const updateProductLambda = new lambda.Function(this, 'UpdateProductLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'updateProduct.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        PRODUCTS_TABLE_NAME: productsTable.tableName,
      },
    });

    const deleteProductLambda = new lambda.Function(this, 'DeleteProductLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'deleteProduct.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        PRODUCTS_TABLE_NAME: productsTable.tableName,
      },
    });

    // Orders Lambda functions 
    const getOrdersLambda = new lambda.Function(this, 'GetOrdersLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'getOrders.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        ORDERS_TABLE_NAME: ordersTable.tableName,
      },
    });

    const createOrderLambda = new lambda.Function(this, 'CreateOrderLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'createOrder.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        ORDERS_TABLE_NAME: ordersTable.tableName,
      },
    });

    // Grant the Lambda function read permissions on the products table
    productsTable.grantReadData(getProductsLambda);
    // Grant the Lambda function covers PutItem, UpdateItem, and DeleteItem permissions on the products table
    productsTable.grantWriteData(createProductLambda);
    productsTable.grantWriteData(updateProductLambda);
    productsTable.grantWriteData(deleteProductLambda);

    // Grant the Lambda function read permissions on the orders table
    ordersTable.grantReadData(getOrdersLambda);
    // Grant the Lambda function write permissions on the orders table
    ordersTable.grantWriteData(createOrderLambda);

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
    // Product Routes (/products)
    const productsResource = api.root.addResource('products');
    productsResource.addMethod('GET', new apigateway.LambdaIntegration(getProductsLambda));
    productsResource.addMethod('POST', new apigateway.LambdaIntegration(createProductLambda));

    // Single Product Routes (/products/{productId})
    const singleProductResource = productsResource.addResource('{productId}');
    singleProductResource.addMethod('PUT', new apigateway.LambdaIntegration(updateProductLambda));
    singleProductResource.addMethod('DELETE', new apigateway.LambdaIntegration(deleteProductLambda));

    // Order Routes (/orders)
    const ordersResource = api.root.addResource('orders');
    ordersResource.addMethod('GET', new apigateway.LambdaIntegration(getOrdersLambda));
    ordersResource.addMethod('POST', new apigateway.LambdaIntegration(createOrderLambda));

    new CfnOutput(this, 'MiniPosApiUrl', {
      value: api.url,
      description: 'Base URL for the Mini POS API Gateway deployment.',
    });

  }
}

module.exports = { MiniPosCdkStack }
