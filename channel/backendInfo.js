
const API_URL = process.env.NEXT_PUBLIC_LAMBDA_API_URL;

/**
 * param {object=} mapBounds - ref) https://apis.map.kakao.com/web/documentation/#Map_getBounds
 *                        ex) { "ha": 127.02713981495673, "qa": 37.495319546330926,
 *                              "oa": 127.03156893480515, "pa": 37.49992258878263 }
 * returns {array<object>}
 * todo use JSDoc and conform type checking
 */
const getCatNameList = async (mapBounds) => {
  // TODO: consider mapBounds - only the cats within the map area
  console.log(`getCatNameList with mapBounds of ${JSON.stringify(mapBounds)}`);

  let nameList = [];
  try {
    const resp = await fetch(`${API_URL}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'operation': 'cat-name-list'
      }),
      method: 'POST',
    });
    nameList = await resp.json();
  } catch (e) {
    console.error('Error in fetching cat-name-list', e);
  }

  return nameList;
}

const getCatPhotoList = async (mapBounds) => {
  // TODO: consider mapBounds - only the cats within the map area
  console.log(`getCatPhotoList with mapBounds of ${JSON.stringify(mapBounds)}`);

  let photoList = [];
  try {
    const resp = await fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'operation': 'cat-photo-list'
      }),
      method: 'POST',
    });
    photoList = await resp.json();
  } catch (e) {
    console.error('Error in fetching cat-photo-list', e);
  }

  return photoList;
}

/**
 * @param {string} catId
 * @returns {promise}
 */
const getCatPhotoUrl = (catId) => {
  const urlGetter = async () => {
    const resp = await fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'operation': 'photo-url',
        'payload': {
          'Item': {
            'cat_id': catId
          }
        }
      }),
      method: 'POST',
    });
    return await resp.text();
  }

  return urlGetter();
}

/**
 * @param {string} catId
 * @returns {string}
 */
const getCatThumbnailUrl = async (catId) => {
  let url = '';
  try {
    const resp = await fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'operation': 'thumbnail-url',
        'payload': {
          'Item': {
            'cat_id': catId
          }
        }
      }),
      method: 'POST',
    });
    url = await resp.text();
  } catch (e) {
    console.error(`Error in fetching thumbnail-url for ${catId}`, e);
  }

  return url || '/question-mark.png';
}

// TODO: use current user location
const getMapInitPosition = async () => {
  const catList = await getCatPhotoList();
  const randomIndex = parseInt(catList.length * Math.random());
  const catInfo = catList[randomIndex];

  return {
    lat: catInfo?.lat || 33.450701,
    lng: catInfo?.lng || 126.570667,
  };
}

const addNewCat = async (name, photoUrl) => {
  console.log('add a new cat: ' + name + ', ' + photoUrl);

  let newCatId = '';
  try {
    const resp = await fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'operation': 'create',
        'payload': {
          'Item': {
            'name': name
          }
        }
      }),
      method: 'POST',
    });
    newCatId = await resp.text();
  } catch (e) {
    console.error(`Error in 'creat' for ${name}`, e);
  }

  if (!newCatId) {
    return;
  }

  console.log('newCat created: id ' + JSON.stringify(newCatId));

  try {
    const resp = await fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'operation': 'insert-photo',
        'payload': {
          'Item': {
            'cat_id': newCatId,
            // TODO: position handling
            'lat': 37.498004414546934,
            'lng': 127.02770621963765,
            'photo_url': photoUrl,
            'thumbnail_url': '',
          },
        },
      }),
      method: 'POST',
    });
    newCatId = await resp.text();
  } catch (e) {
    console.error(`Error in 'insert-photo' for ${name}`, e);
  }
}

export {
  getMapInitPosition,
  getCatNameList,
  getCatPhotoList,
  getCatPhotoUrl,
  getCatThumbnailUrl,
  addNewCat,
};
