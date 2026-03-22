import { persistData } from '../helpers';
import mapState from './state/mapState';

export const getMapSortBy = () => mapState.sortBy;

export const setMapSortBy = sortBy => (mapState.sortBy = sortBy);

export const addSavedMarkerReference = function (coordinates, name) {
  mapState.savedMarkerReferences.push({ coordinates, name });
  persistData('markers', mapState.savedMarkerReferences);
};

export const getSavedMarkerReferences = () => mapState.savedMarkerReferences;

export const removeSavedMarkerReference = function (pokemonName) {
  const removedSavedMarkerReference = mapState.savedMarkerReferences.find(
    marker => marker.name === pokemonName,
  );

  mapState.savedMarkerReferences.splice(
    mapState.savedMarkerReferences.indexOf(removedSavedMarkerReference),
    1,
  );

  persistData('markers', mapState.savedMarkerReferences);
  return removedSavedMarkerReference;
};

export const addMarkerObject = marker => mapState.allMarkerObjects.push(marker);

export const getAllMarkerObjects = () => mapState.allMarkerObjects;

// export const removeMarkerObject = function (marker) {
//   mapState.allMarkerObjects.splice(allMarkerObjects.indexOf(marker), 1);
// };

export const editMarker = function (pokemonName, newLat, newLng) {
  // editing saved marker
  const savedMarkerReference = mapState.savedMarkerReferences.find(
    marker => marker.name === pokemonName,
  );
  savedMarkerReference.coordinates = { latitude: newLat, longitude: newLng };

  // editing marker reference
  const markerObject = mapState.allMarkerObjects.find(
    marker => marker.title === pokemonName,
  );
  markerObject.setPosition({ lat: newLat, lng: newLng });

  persistData('markers', mapState.savedMarkerReferences);
};

export const removeMarkerObject = function (targetLat, targetLng) {
  const markerObject = mapState.allMarkerObjects.find(
    marker =>
      marker.position.lat() === targetLat &&
      marker.position.lng() === targetLng,
  );

  mapState.allMarkerObjects.splice(
    mapState.allMarkerObjects.indexOf(markerObject),
    1,
  );

  return markerObject;
};

export const hydrateQueryBatch = function (queryBatch, pokemonBatch) {
  for (let pokemon of queryBatch) {
    const additionalInfo = pokemonBatch.find(
      marker => marker.name === pokemon.name,
    );

    pokemon.location = additionalInfo.location;
    pokemon.latLng = additionalInfo.latLng;
    pokemon.types = additionalInfo.types;
  }

  return queryBatch;
};

export const hydrateLocation = function (pokemon, location) {
  pokemon.pokemonLocation = location;
  console.log(pokemon);
  return pokemon;
};

const init = function () {
  const storageMapMarkers = localStorage.getItem('markers');

  if (storageMapMarkers)
    mapState.savedMarkerReferences = JSON.parse(storageMapMarkers);
};

init();
