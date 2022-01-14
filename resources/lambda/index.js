const AWS = require('aws-sdk');

const s3Client = new AWS.S3({
  signatureVersion: 'v4'
});

const isExisted = async (params) => {
  try{
    console.log(`headObject: ${JSON.stringify(params)}`)
    await s3Client.headObject(params).promise();
    console.log('return true')
    return true;
  } catch (e) {
    console.error(e)
    return false;
  }
};

const fetchUploadUrl = async (fileName, folderName) => {
  const bucket = process.env.BUCKET || 'formik-bucket';
  const params = {
    Bucket: bucket,
    Key: `${folderName}/${fileName}`,
    ContentType: 'application/octet-stream',
  };
  try {
    const url = await s3Client.getSignedUrlPromise('putObject', params);
    console.log(`Upload URL: ${url}`);
    return url;
  } catch (error) {
    console.log(
      `Error creating singed url to upload file ${fileName} in folder ${folderName}`
    );
    throw error;
  }
};

const fetchViewUrl = async (file) => {
  const bucket = process.env.BUCKET || 'formik-bucket';
  console.log(`bucket: ${bucket}`);
  console.log(`file: ${file}`);
  const params = { Bucket: bucket, Key: file };
  try {
    // check for existing file first
    console.log('checking if file exists')
    const existed = await isExisted(params);
    console.log(`existed=${existed}`);
    if (existed) {
      const url = await s3Client.getSignedUrlPromise('getObject', params);
      console.log(`View URL: ${url}`);
      return url;
    } else {
      throw new Error(`File ${file} not found`);
    }
  } catch (error) {
    console.log(`Error creating singed url to read file ${file}`);
    throw error;
  }
};

exports.handler = async (event, context) => {
	console.log(JSON.stringify(event));
	const path = event.path;
	const reqType = event.httpMethod;
	const { file, folder } = event.queryStringParameters;
	let presignedUrl = '';
	try {
		if (reqType === 'GET') {
			presignedUrl = await fetchViewUrl(file);
			console.log(`presignedUrl=${presignedUrl}`);
		} else if (reqType === 'PUT') {
			presignedUrl = await fetchUploadUrl(file, folder);
			console.log(`presignedUrl=${presignedUrl}`);
		}
		return {
			body: JSON.stringify({ url: presignedUrl }),
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Headers': '*',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT',
			},
			statusCode: 200,
			isBase64Encoded: false,
		};
	} catch (error) {
		console.error(error);
		return {
			body: JSON.stringify({ message: error.message }),
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Headers': '*',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT',
			},
			statusCode: 500,
			isBase64Encoded: false,
		};
	}
};
