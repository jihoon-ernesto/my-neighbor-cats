/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_CATSBUCKET_BUCKETNAME
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
const s3 = new AWS.S3({ signatureVersion: 'v4' });
const sharp = require('sharp');

exports.handler = async (event) => {
    // handle SNS topic event: 'cat-photo-uploaded'
    const snsMsgObj = JSON.parse(event.Records[0].Sns.Message);
    const s3Record = snsMsgObj.Records[0].s3;

    const srcBucket = s3Record.bucket.name;
    const srcKey = decodeURIComponent(s3Record.object.key.replace(/\+/g, ' '));
    console.log(`received sns info: bucket ${srcBucket}, key ${srcKey}`);

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

    const size = 200;

    try {
        const info = await sharp(origimage.Body).metadata();
        const left = info.width > size ? parseInt(info.width / 4) : 0;
        const top = info.height > size ? parseInt(info.height / 4) : 0;
        const width = info.width > size ? parseInt(info.width / 2) : size;
        const height = info.height > size ? parseInt(info.height / 2) : size;

        var buffer = await sharp(origimage.Body).extract({left:left, top:top, width:width, height:height}).toBuffer();

    } catch (error) {
        console.log(error);
        return;
    }


    try {
        const destparams = {
            Bucket: thumbBucket,
            Key: thumbKey,
            Body: buffer,
            ContentType: "image",
            ACL: 'public-read'
        };

        const putResult = await s3.putObject(destparams).promise();

    } catch (error) {
        console.log(error);
        return;
    }

    console.log('Successfully resized ' + srcBucket + '/' + srcKey +
        ' and uploaded to ' + thumbBucket + '/' + thumbKey);
};
