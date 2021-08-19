// TODO: remove sample data

const sampleCatList = [
  {
    'id': 'cat-id-1',
    'name': 'cat-name-1',
    'thumbnail': 'cat-thumbnail-url-1',
    'position': { 'lat': 37.499590490909185, 'lng': 127.0263723554437 },
  },
  {
    'id': 'cat-id-2',
    'name': 'cat-name-2',
    'thumbnail': 'cat-thumbnail-url-2',
    'position': { 'lat': 37.499427948430814, 'lng': 127.02794423197847 },
  },
  {
    'id': 'cat-id-3',
    'name': 'cat-name-3',
    'thumbnail': 'cat-thumbnail-url-3',
    'position': { 'lat': 37.498553760499505, 'lng': 127.02882598822454 },
  },
  {
    'id': 'cat-id-4',
    'name': 'cat-name-4',
    'thumbnail': 'cat-thumbnail-url-4',
    'position': { 'lat': 37.497625593121384, 'lng': 127.02935713582038 },
  },
  {
    'id': 'cat-id-5',
    'name': 'cat-name-5',
    'thumbnail': 'cat-thumbnail-url-5',
    'position': { 'lat': 37.49646391248451, 'lng': 127.02675574250912 },
  },
  {
    'id': 'cat-id-6',
    'name': 'cat-name-6',
    'thumbnail': 'cat-thumbnail-url-6',
    'position': { 'lat': 37.49629291770947, 'lng': 127.02587362608637 },
  },
  {
    'id': 'cat-id-7',
    'name': 'cat-name-7',
    'thumbnail': 'cat-thumbnail-url-7',
    'position': { 'lat': 37.49754540521486, 'lng': 127.02546694890695 },
  },
];

const sampleCatPhotos = {
  'cat-id-1': '/sample-photos/29BAABB8-2BA2-499E-8645-6571F3C6B0C2.JPG',
  'cat-id-2': '/sample-photos/B1213691-A457-43CA-A81B-5AA66DFB202B.JPG',
  'cat-id-3': '/sample-photos/3D63B682-3D72-45DF-B89D-1CDDADC1C42F.JPG',
  'cat-id-4': '/sample-photos/CAB412B8-6FB7-411D-B306-450BEF257129.JPG',
  'cat-id-5': '/sample-photos/7490F5FA-2FA5-4BDD-A345-E91F00B634B5.JPG',
  'cat-id-6': '/sample-photos/CBB1D4FA-075E-4C39-9B8C-A51AEF3CC456.JPG',
  'cat-id-7': '/sample-photos/8A67ECDA-B080-47D4-BEC2-2FF54DA49922.JPG',
};

// TODO: get info from backend
const getCatList = (mapBounds) => {
  // TODO: consider mapBounds - only the cats within the map area
  return sampleCatList;
}

// TODO: get info from backend
const getCatPhotoUrl = (id) => {
  return sampleCatPhotos[id] || '';
}

// TODO: use current user location
const getMapInitPosition = () => {
  const catList = sampleCatList;
  const randomIndex = parseInt(catList.length * Math.random());

  return catList[randomIndex]?.position || { lat: 0, lng: 0 };
}

export {
  getMapInitPosition,
  getCatList,
  getCatPhotoUrl,
};
