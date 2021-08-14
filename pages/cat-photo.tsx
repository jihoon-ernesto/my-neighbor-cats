import Image from 'next/image';
import { getRandomPhotoUrl } from '../channel/backendInfo.js';

// TODO: fix type
const Photo: any = () => {

  // TODO: get proper URL of a cat photo
  const photoUrl = getRandomPhotoUrl();

  return (
    <>
      <Image
        src={photoUrl}
        alt="cat photo"
        layout="fill"
        objectFit="contain"
      />
    </>
  );
};

export default Photo;
