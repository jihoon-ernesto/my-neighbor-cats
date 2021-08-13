import React, { useRef } from 'react';
import S3 from 'react-aws-s3';

// source: https://medium.com/@steven_creates/uploading-files-to-s3-using-react-js-hooks-react-aws-s3-c4c0684f38b3

function Upload() {
  const fileInput = useRef();

  const handleClick = event => {
    event.preventDefault();
    let file = fileInput.current.files[0];
    let newFileName = file.name;

    const config = {
      bucketName: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      dirName: process.env.NEXT_PUBLIC_AWS_DIR_NAME,            // optional
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
    }

    const ReactS3Client = new S3(config);
    ReactS3Client.uploadFile(file, newFileName)
      .then(data => {
        console.log(data);
        if (data.status === 204) {
          console.log('upload success');
        } else {
          console.log('upload fail');
        }
      });
  }
  return (
    <>
      <form className='upload-steps' onSubmit={handleClick}>
        <label>
          Upload file:
          <input type='file' ref={fileInput} />
        </label>
        <br />
        <button type='submit'>Upload</button>
      </form>
    </>
  );
}

export default Upload;
