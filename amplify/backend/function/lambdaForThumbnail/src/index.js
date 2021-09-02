const AWS = require('aws-sdk');
const util = require('util');
const s3 = new AWS.S3({ signatureVersion: 'v4' });
const sharp = require('sharp');

exports.handler = async (event) => {
    const srcBucket = event.Records[0].s3.bucket.name;
    const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

    const thumbBucket = srcBucket + '-resized';
    const thumbKey = 'resized-' + srcKey;

    const typeMatch = srcKey.match(/\.([^.]*)$/);
    if (!typeMatch) {
        console.log('Could not determine the image type.');
        return;
    }
    const imageType = typeMatch[1].toLowerCase();
    if (imageType != 'jpeg' && imageType != 'jpg' && imageType != 'png') {
        console.log(`Unsupported image type: ${imageType}`);
        return;
    }

    try {
        const params = {
            Bucket: srcBucket,
            Key: srcKey,
        }; 
        var origimage = await s3.getObject(params).promise();
    } catch (error) {
        console.log(error);
        return;
    }  

    const width  = 200;

    try { 
        var buffer = await sharp(origimage.Body).resize(width).toBuffer();
            
    } catch (error) {
        console.log(error);
        return;
    } 


    try {
        const destparams = {
            Bucket: thumbBucket,
            Key: thumbKey,
            Body: buffer,
            ContentType: "image"
        };
  
        const putResult = await s3.putObject(destparams).promise(); 
        
    } catch (error) {
        console.log(error);
        return;
    } 
        
    console.log('Successfully resized ' + srcBucket + '/' + srcKey +
        ' and uploaded to ' + thumbBucket + '/' + thumbKey); 
};
