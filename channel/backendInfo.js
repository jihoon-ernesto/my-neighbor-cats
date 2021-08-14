// TODO: get info from backend
const getCatPositions = () => {
  return [
    { lat: 37.499590490909185, lng: 127.0263723554437 },
    { lat: 37.499427948430814, lng: 127.02794423197847 },
    { lat: 37.498553760499505, lng: 127.02882598822454 },
    { lat: 37.497625593121384, lng: 127.02935713582038 },
    { lat: 37.49646391248451, lng: 127.02675574250912 },
    { lat: 37.49629291770947, lng: 127.02587362608637 },
    { lat: 37.49754540521486, lng: 127.02546694890695 },
  ];
}

const getMapInitPosition = () => {
  // return a random position among the current cat positions
  const catPositions = getCatPositions();
  const randomIndex = parseInt(catPositions.length * Math.random());

  return catPositions[randomIndex];
}

// TODO: (currently temp function)
const getCatPhotoUrls = () => {
  return [
    '/sample-photos/29BAABB8-2BA2-499E-8645-6571F3C6B0C2.JPG',
    '/sample-photos/B1213691-A457-43CA-A81B-5AA66DFB202B.JPG',
    '/sample-photos/3D63B682-3D72-45DF-B89D-1CDDADC1C42F.JPG',
    '/sample-photos/CAB412B8-6FB7-411D-B306-450BEF257129.JPG',
    '/sample-photos/7490F5FA-2FA5-4BDD-A345-E91F00B634B5.JPG',
    '/sample-photos/CBB1D4FA-075E-4C39-9B8C-A51AEF3CC456.JPG',
    '/sample-photos/8A67ECDA-B080-47D4-BEC2-2FF54DA49922.JPG',
  ];
}

const getRandomPhotoUrl = () => {
  const photoUrls = getCatPhotoUrls();
  const randomIndex = parseInt(photoUrls.length * Math.random());

  return photoUrls[randomIndex];
}

export {
  getCatPositions,
  getMapInitPosition,
  getCatPhotoUrls,
  getRandomPhotoUrl,
};
