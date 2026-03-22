/**
 * Map Model
 * ---------------------
 * Manages data to be rendered on the Map module.
 *
 * Directly reads and modifies mapState.
 * Reads and manipulates data in local storage.
 * Does not manipulate the DOM.
 */

import mapState from './state/mapState';
import { persistData } from '../helpers';

export const getMapSortBy = () => mapState.sortBy;

/**
 * Sets sorting mode of Map module.
 *
 * @param {string} sortBy - 'name' or 'id' or 'date'
 */
export const setMapSortBy = sortBy => (mapState.sortBy = sortBy);

export const getSavedMarkerReferences = () => mapState.savedMarkerReferences;

/**
 * Adds (shallow) marker reference to savedMarkerReferences in mapState.
 *
 * @param {Object} coordinates - lat & lng of Pokémon
 * @param {string} name - Name of Pokémon
 */
export const addSavedMarkerReference = function (coordinates, name) {
  mapState.savedMarkerReferences.push({ coordinates, name });
  persistData('markers', mapState.savedMarkerReferences);
};

/**
 * Removes (shallow) marker reference from savedMarkerReferences in mapState.
 *
 * @param {string} name - Name of Pokémon to remove
 */
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

/**
 * Adds marker object to allMarkerObjects in mapState.
 *
 * @param {Object} coordinates - lat & lng of Pokémon
 */
export const addMarkerObject = marker => mapState.allMarkerObjects.push(marker);

export const getAllMarkerObjects = () => mapState.allMarkerObjects;

/**
 * Remove marker object from mapState.
 *
 * @param {number} targetLat - Latitude
 * @param {number} targetLng - Longitude
 */
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

/**
 * Edits the coordinates of (shallow) marker reference and marker object in mapState.
 *
 * @param {string} pokemonName - Name of Pokémon
 * @param {number} newLat - New latitude
 * @param {number} newLng - New longitude
 */
export const editMarker = function (pokemonName, newLat, newLng) {
  // Editing (shallow) marker reference
  const savedMarkerReference = mapState.savedMarkerReferences.find(
    marker => marker.name === pokemonName,
  );
  savedMarkerReference.coordinates = { latitude: newLat, longitude: newLng };

  // Editing marker object
  const markerObject = mapState.allMarkerObjects.find(
    marker => marker.title === pokemonName,
  );
  markerObject.setPosition({ lat: newLat, lng: newLng });

  persistData('markers', mapState.savedMarkerReferences);
};

/**
 * Hydrates Pokémon object with location data.
 *
 * @param {Object} pokemon - Pokémon lacking location data
 * @param {string} location - Location to be added
 */
export const hydrateLocation = function (pokemon, location) {
  pokemon.pokemonLocation = location;
  return pokemon;
};

/**
 * Hydrates queried caught Pokémon with location, latLng, and types data from the Pokémon batch.
 *
 * @param {Object} queryBatch - queried Pokémon
 * @param {Object} pokemonBatch - original pool of caught Pokémon
 */
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

// To check local storage upon initial load and update Markers (mapState) with persisted data
const init = function () {
  const storageMapMarkers = localStorage.getItem('markers');

  if (storageMapMarkers)
    mapState.savedMarkerReferences = JSON.parse(storageMapMarkers);
};

init();
