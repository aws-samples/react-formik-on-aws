import * as cdk from '@aws-cdk/core';
import * as apigw from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3Deployment from "@aws-cdk/aws-s3-deployment";
import { Tags, Duration } from "@aws-cdk/core";
import path from 'path';
import config from "../config/config.json";
export class FormikS3Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const uiCodeBucket = new s3.Bucket(this, 'FormikBucketClientApp', {
      bucketName: `formik-bucket-ui-app-${this.account}`,
      publicReadAccess: true,
      websiteIndexDocument: "index.html"
    });
    const deployment = new s3Deployment.BucketDeployment(this, "deployStaticWebsite", {
      sources: [s3Deployment.Source.asset(`${path.resolve(__dirname)}/../ui/formik-s3-react-app/build`)],
      destinationBucket: uiCodeBucket
   });

    const bucket = new s3.Bucket(this, 'FormikBucket', {
      bucketName: `formik-bucket-${this.account}`,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
          ],
          allowedOrigins: ['http://localhost:3000'], // TODOs: Change to correct URL
          allowedHeaders: ['*'],
        },
      ]
    });

    const handler = new lambda.Function(this, "handler", {
      code: lambda.Code.fromAsset(`${path.resolve(__dirname)}/../dist/lambda/build`),
      handler: `index.handler`,
      runtime: lambda.Runtime.NODEJS_14_X,
      timeout: Duration.seconds(5),
      environment: {
        BUCKET: bucket.bucketName
      }
    });

    const api = new apigw.LambdaRestApi(this, config.api.id, {
      handler,
      description: config.description,
      proxy: false
    });

    const document = api.root.addResource('document');
    document.addMethod('GET');  // GET /document
    document.addMethod('PUT'); // PUT /document
    document.addMethod('OPTIONS'); 
    bucket.grantReadWrite(handler);

    const tags = config.tags

    tags.forEach(tag => {
      Tags.of(this).add(tag.key, tag.value)
      Tags.of(handler).add(tag.key, tag.value)
    })

    new cdk.CfnOutput(this, 'apiUrl', {value: api.url});
    new cdk.CfnOutput(this, 'bucketWebsiteUrl', {
      value: uiCodeBucket.bucketWebsiteUrl,
    });
  }
}
