
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
  // console.log(`getCatNameList with mapBounds of ${JSON.stringify(mapBounds)}`);

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

const getCatName = async catId => {
  // TODO: don't call getCatNameList every time
  const nameList = await getCatNameList();

  const cat = nameList.find(({cat_id}) => cat_id === catId);
  return cat?.name;
}

const getCatPhotoList = async (mapBounds) => {
  // TODO: consider mapBounds - only the cats within the map area
  // console.log(`getCatPhotoList with mapBounds of ${JSON.stringify(mapBounds)}`);

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

  if (url) {
    return url;
  }

  // TODO: remove this workaround code after implementing DB update properly
  const photoUrl = await getCatPhotoUrl(catId);
  return photoUrl
    .replace('my-cats-bucket', 'my-cats-bucket-resized')
    .replace('.com/', '.com/resized-');
}

const getRandomId = async () => {
  const catList = await getCatPhotoList();
  const randomIndex = parseInt(catList.length * Math.random());
  const cat = catList[randomIndex];

  return cat?.cat_id;
}

// TODO: make a dedicated API
const getCatPosition = async catId => {
  const catPhotoList = await getCatPhotoList();
  const cat = catPhotoList.find(({cat_id}) => cat_id === catId);

  // TODO: change the default value
  return {
    lat: cat?.lat || 33.450701,
    lng: cat?.lng || 126.570667,
  };
}

const addNewCat = async (catName, photoUrl, username) => {
  console.log('add a new cat: ' + catName + ', ' + photoUrl);

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
            'name': catName
          }
        }
      }),
      method: 'POST',
    });
    newCatId = await resp.text();
  } catch (e) {
    console.error(`Error in 'creat' for ${catName}`, e);
  }

  if (!newCatId) {
    return {
      ok: false,
      msg: 'no cat id',
    };
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
            'uploader': username,
            'photo_url': photoUrl,
            // TODO: thumbnail_url handling
            'thumbnail_url': '',
          },
        },
      }),
      method: 'POST',
    });

    if (!resp.ok) {
      const respObj = await resp.json();
      return {
        ok: false,
        msg: respObj.msg,
      };
    }
  } catch (e) {
    console.error(`Error in 'insert-photo' for ${name}`, e);
  }

  return {
    ok: true,
    catId: newCatId,
  };
}

export {
  getRandomId,
  getCatPosition,
  getCatNameList,
  getCatPhotoList,
  getCatPhotoUrl,
  getCatThumbnailUrl,
  getCatName,
  addNewCat,
};
