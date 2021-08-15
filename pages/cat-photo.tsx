import Image from 'next/image';
import { getRandomPhotoUrl } from '../channel/backendInfo.js';
import styles from '../styles/CatPhoto.module.css'

// TODO: fix type
const Photo: any = () => {

  // TODO: get proper URL of a cat photo
  const photoUrl = getRandomPhotoUrl();

  return (
    <>
      <p className={styles.loadingMsg}>
        Loading...
      </p>

      <Image
        src={photoUrl}
        alt="cat photo"
        layout="fill"
        objectFit="contain"
      />

      <button
        onClick={() => window.history.back()}
        style={{
          width: 80,
          height: 40,
          fontSize: 14,
          position: 'absolute',
          cursor: 'pointer',
        }}
        >
        ← Back
      </button>
    </>
  );
};

export default Photo;
