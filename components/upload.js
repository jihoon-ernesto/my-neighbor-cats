import React, { useRef } from 'react';
import S3 from 'react-aws-s3';
import { addNewCat } from "../channel/backendInfo";
import styles from '../styles/Upload.module.scss';

// source: https://medium.com/@steven_creates/uploading-files-to-s3-using-react-js-hooks-react-aws-s3-c4c0684f38b3

function Upload({ pageReloader, username }) {
  const fileInput = useRef();

  const handleClick = event => {
    event.preventDefault();
    let file = fileInput.current.files[0];
    if (!file) {
      alert('Choose a photo to upload');
      return;
    }
    let newFileName = file.name;

    const catName = event.target['cat-name'].value;
    if (!catName) {
      alert('Give a name to the cat')
    }

    const config = {
      bucketName: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      dirName: process.env.NEXT_PUBLIC_AWS_DIR_NAME,            // optional
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
    }

    const ReactS3Client = new S3(config);
    ReactS3Client.uploadFile(file, newFileName)
      .then(async data => {
        console.log(data);
        if (data.status === 204) {
          console.log('upload success - url: ' + data.location);

          const result = await addNewCat(catName, data.location, username);
          if (!result.ok) {
            // TODO: show in a modal info box, instead of 'alert'
            alert(result.msg);
          }
          else if (result.ok && result.catId) {
            alert('new cat added: ' + catName);
            pageReloader(result.catId, username);
          }
        } else {
          alert('upload failure');
        }
      })
      .finally(() => {
        // clear form
        fileInput.current.value = '';
        event.target['cat-name'].value = '';
      });
  }

  return (
    <>
      <form className={styles.uploadForm} onSubmit={handleClick}>
        <label>
          Cat photo:{' '}
          <input type='file' ref={fileInput} disabled={!username} />
          <br />
          Cat name:{' '}
          <input type='text' name='cat-name' disabled={!username} />
        </label>
        <button type='submit' disabled={!username}>Add a new 🐱</button>
      </form>
    </>
  );
}

export default Upload;
