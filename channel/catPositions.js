const getMapInitPosition = () => {
  // return a random position among the current cat positions
  const catPositions = getCatPositions();
  const randomIndex = parseInt(catPositions.length * Math.random());

  return catPositions[randomIndex];
}

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

export {
  getMapInitPosition,
  getCatPositions,
};
