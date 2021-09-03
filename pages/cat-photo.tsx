import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getCatName, getCatPhotoUrl } from '../channel/backendInfo.js';
import styles from '../styles/CatPhoto.module.scss';

// TODO: fix type
const Photo: any = () => {

  const router = useRouter();
  const [imageSrc, setImageSrc] = useState('');
  const [catName, setCatName] = useState('');

  useEffect(() => {
    const { id } = router.query;
    if (!id) {
      return;
    }

    const catId = Array.isArray(id) ? id[0] : id || '';

    getCatName(catId)
      .then((name: string) => {
        setCatName(name);
      });

    getCatPhotoUrl(catId)
      .then((url: string) => {
        setImageSrc(url);
      });

  }, [router.query]);

  return (
    <>
      <p className={styles.loadingMsg}>
        Loading...
      </p>

      {catName && (
        <div className={styles.catNameBox}>
          <p className={styles.catName}>
            {catName}
          </p>
        </div>
      )}

      {imageSrc && (
        <Image
          src={imageSrc}
          alt="cat photo"
          layout="fill"
          objectFit="contain"
        />
      )}

      <button
        className={styles.back}
        onClick={() => router.back()}
        >
        ← Back to the map
      </button>
    </>
  );
};

export default Photo;
