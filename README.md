# Sample React Formik


## Requirements

* [Create an AWS account](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html) if you do not already have one and log in. The IAM user that you use must have sufficient permissions to make necessary AWS service calls and manage AWS resources.
* [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) installed and configured
* [Git Installed](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Node and NPM](https://nodejs.org/en/download/) installed
* [AWS Cloud Development Kit](https://docs.aws.amazon.com/cdk/latest/guide/cli.html) (AWS CDK) installed

## Deployment Instructions

1. Create a new directory, navigate to that directory in a terminal and clone the GitHub repository:
    ```bash
      git clone https://github.com/aws-samples/react-formik-on-aws
    ```
2. From the command line, use npm to install the development dependencies:
    ```bash
      npm install
    ```

3. From the command line, use npm to build the React website:
    ```bash
      npm run build:ui 
    ```

4. Bundle Lambda function
    ```bash
      npx esbuild resources/lambda/index.js --bundle --platform=node --target=node12 --external:aws-sdk --outfile=dist/lambda/build/index.js
    ```
6. Configure CDK
    ```bash
      cdk bootstrap aws://<ACCOUNT_ID>/<ACCOUNT_REGION>
    ```
7. To deploy from the command line use the following:
    ```bash
      npx cdk deploy
    ```

## Testing

1. After deployment, the output shows the API Gateway URL, open the link in the browser.

## Cleanup
 
1. From the command line, use the following in the source folder
    ```bash
    npx cdk destroy
    ```
2. Confirm the removal and wait for the resource deletion to complete.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `npx cdk deploy`      deploy this stack to your default AWS account/region
 * `npx cdk diff`        compare deployed stack with current state
 * `npx cdk synth`       emits the synthesized CloudFormation template
