import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getCatPhotoUrl } from '../channel/backendInfo.js';
import styles from '../styles/CatPhoto.module.css'

// TODO: fix type
const Photo: any = () => {

  const router = useRouter();
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const { id } = router.query;
    if (!id) {
      return;
    }

    const catId = Array.isArray(id) ? id[0] : id || '';
    getCatPhotoUrl(catId)
      .then((result: string) => {
        setImageSrc(result);
        console.log('id: ' + catId + ', photoUrl: ' + result);
      });

  }, [router.query]);

  return (
    <>
      <p className={styles.loadingMsg}>
        Loading...
      </p>

      {imageSrc && (
        <Image
          src={imageSrc}
          alt="cat photo"
          layout="fill"
          objectFit="contain"
        />
      )}

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
