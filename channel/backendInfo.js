
const API_URL = process.env.NEXT_PUBLIC_LAMBDA_API_URL;

/**
 * param {object=} mapBounds - ref) https://apis.map.kakao.com/web/documentation/#Map_getBounds
 *                        ex) { "ha": 127.02713981495673, "qa": 37.495319546330926,
 *                              "oa": 127.03156893480515, "pa": 37.49992258878263 }
 * returns {array<object>}
 * todo get info from backend
 * todo use JSDoc and conform type checking
 */
const getCatList = async (mapBounds) => {
  // TODO: consider mapBounds - only the cats within the map area
  console.log(`getCatList with mapBounds of ${JSON.stringify(mapBounds)}`);

  let catList = [];
  try {
    const resp = await fetch(`${API_URL}?q=cat-list`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET',
    });
    catList = await resp.json();
  } catch (e) {
    console.error('Error in fetching cat-list', e);
  }

  return catList;
}

/**
 * @param {string} catId
 * @returns {promise}
 * @todo get info from backend
 */
const getCatPhotoUrl = (catId) => {
  const urlGetter = async () => {
    const resp = await fetch(`${API_URL}?q=photo-url&id=${catId}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET',
    });
    return await resp.text();
  }

  return urlGetter();
}

/**
 * @param {string} catId
 * @returns {string}
 * @todo get info from backend
 */
const getCatThumbnailUrl = async (catId) => {
  let url = '';
  try {
    const resp = await fetch(`${API_URL}?q=thumbnail-url&id=${catId}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET',
    });
    url = await resp.text();
  } catch (e) {
    console.error(`Error in fetching thumbnail-url for ${catId}`, e);
  }

  return url || '/question-mark.png';
}

// TODO: use current user location
const getMapInitPosition = async () => {
  const catList = await getCatList();
  const randomIndex = parseInt(catList.length * Math.random());

  return catList[randomIndex]?.position || {
    lat: 33.450701,
    lng: 126.570667,
  };
}

export {
  getMapInitPosition,
  getCatList,
  getCatPhotoUrl,
  getCatThumbnailUrl,
};
