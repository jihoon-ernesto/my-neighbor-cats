import { getRandomPhotoUrl } from '../channel/backendInfo.js';

// TODO: fix type
const Photo: any = () => {

  // TODO: get proper URL of a cat photo
  const photoUrl = getRandomPhotoUrl();

  return (
    <>
      <img src={photoUrl} style={{ width: "100%", height: "100%" }} />
    </>
  );
};

export default Photo;
