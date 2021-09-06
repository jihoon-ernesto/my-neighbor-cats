/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_CATSDB2_ARN
	STORAGE_CATSDB2_NAME
	STORAGE_CATSDB2_STREAMARN
Amplify Params - DO NOT EDIT */

'use strict';

const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();
const dbClient = new AWS.DynamoDB.DocumentClient();

function detectLabels(bucket, key) {
    const params = {
      Image: {
       S3Object: {
        Bucket: bucket, 
        Name: key
       }
      }, 
      MaxLabels: 5, 
      MinConfidence: 85
     };
  
     return rekognition.detectLabels(params).promise().then(data => {
        return data.Labels;
     }).catch(error => {
       console.log(error);
       return error;
     });  
  }
  
  function checkIsACat(labels) {
    return labels
    .map(label => {
      return label.Name === 'Cat' ? true : false
    }).some( val => {
      return val === true;
    });
  }
  
  function removeImage(bucket, key) {
    const params = {
      Bucket: bucket, 
      Key: key
     };
  
     return s3.deleteObject(params).promise(); 
  }

function scanDb(filename) {
  const scanParams = {
    TableName : process.env.STORAGE_CATSDB2_NAME,
    FilterExpression: "contains(photo_url, :f)",
    ExpressionAttributeValues: {
      ":f": filename,
    },
  };

  return dbClient.scan(scanParams).promise();
}  

function updateDb(catId, dataType, isACat) {
  const updateParams = {
    TableName: process.env.STORAGE_CATSDB2_NAME,
    Key: {
      cat_id: catId,
      data_type: dataType,
    },
    UpdateExpression: "set is_cat = :is_cat",
    ExpressionAttributeValues: {
        ":is_cat": isACat,
    },
    ReturnValues: "UPDATED_NEW"
  };

  return dbClient.update(updateParams).promise();
}

exports.handler = async (event) => {
  // handle SNS topic event: 'cat-photo-uploaded'
  const snsMsgObj = JSON.parse(event.Records[0].Sns.Message);

  const s3Record = snsMsgObj.Records[0].s3;
  const bucket = s3Record.bucket.name;
  const key = s3Record.object.key;

  console.log(`A file named ${key} was put in a bucket ${bucket}`);

  let isACat;

  // Detect the labels
  return detectLabels(bucket, key).then(labels => {
    console.log(labels);
    isACat = checkIsACat(labels);

    console.log(isACat);
    // if (!isACat) {
    //   return removeImage(bucket, key).then(() => {
    //     console.log('The image was not a cat and was removed');
    //     return;
    //   });
    // }

    console.log('call scanDb');
    return scanDb(key);
  })
  .then(data => {
    console.assert(data.Items.length === 1);
    const item = data.Items[0];

    console.log('call updateDb: cat_id ' + item.cat_id);
    return updateDb(item.cat_id, item.data_type, isACat);
  })
  .then(data => {
    console.log('done: ' + JSON.stringify(data));
  })
  .catch(error => {
    console.error('error: ' + error);
    return error;
  })

};
