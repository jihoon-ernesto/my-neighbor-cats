'use strict';

const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();

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

exports.handler = async (event) => {
  // handle SNS topic event: 'cat-photo-uploaded'
  const snsMsgObj = JSON.parse(event.Records[0].Sns.Message);

  const s3Record = snsMsgObj.Records[0].s3;
  const bucket = s3Record.bucket.name;
  const key = s3Record.object.key;

  console.log(`A file named ${key} was put in a bucket ${bucket}`);

  // Detect the labels
  return detectLabels(bucket, key).then(labels => {
    console.log(labels);
    const isACat = checkIsACat(labels);

    console.log(isACat);
    if (!isACat) {
      return removeImage(bucket, key).then(() => {
        console.log('The image was not a cat and was removed');
        return;
      });
    }
  }).catch(error => {
    return error;
  })

};
